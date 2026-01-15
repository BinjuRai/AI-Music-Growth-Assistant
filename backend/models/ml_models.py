from typing import Any, Dict, List
from typing import Tuple

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create composite features from raw metrics.
    """
    df = df.copy()
    df["engagement_score"] = (
        df["total_streams"] * 0.3
        + df["saves"] * 0.25
        + df["shares"] * 0.25
        + df["avg_completion_rate"] * 100 * 0.2
    )

    df["loyalty_score"] = (
        df["listening_sessions"] * 0.4
        + df["avg_session_duration"] / 60 * 0.3
        + (1 - df["skip_rate"]) * 100 * 0.3
    )

    return df


# def perform_clustering(listeners_df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame, float]:
def perform_clustering(listeners_df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame, float]:

    """
    Segments listeners into Superfans, Casual, One-time using K-Means.
    """
    if listeners_df.empty:
        raise ValueError("No listener data available for clustering.")

    df = engineer_features(listeners_df)

    features = [
        "engagement_score",
        "loyalty_score",
        "total_streams",
        "saves",
        "shares",
    ]
    X = df[features].fillna(0)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    kmeans = KMeans(
        n_clusters=3,
        init="k-means++",
        n_init=10,
        max_iter=300,
        random_state=42,
    )

    df["cluster"] = kmeans.fit_predict(X_scaled)

    silhouette_avg = silhouette_score(X_scaled, df["cluster"])

    cluster_stats = (
        df.groupby("cluster")
        .agg(
            {
                "engagement_score": "mean",
                "loyalty_score": "mean",
                "total_streams": "mean",
                "listener_id": "count",
            }
        )
        .rename(columns={"listener_id": "count"})
        .round(2)
    )

    cluster_labels: Dict[int, str] = {}
    for idx in cluster_stats.index:
        avg_engagement = cluster_stats.loc[idx, "engagement_score"]
        if avg_engagement > cluster_stats["engagement_score"].quantile(0.66):
            cluster_labels[idx] = "Superfans"
        elif avg_engagement > cluster_stats["engagement_score"].quantile(0.33):
            cluster_labels[idx] = "Casual Listeners"
        else:
            cluster_labels[idx] = "One-time Listeners"

    df["segment"] = df["cluster"].map(cluster_labels)

    return df, cluster_stats, float(silhouette_avg)


def analyze_sentiment(comments: List[Dict[str, Any]]) -> Dict[str, int]:
    """
    Analyzes audience sentiment from comments using VADER.
    """
    analyzer = SentimentIntensityAnalyzer()
    sentiments: Dict[str, int] = {"positive": 0, "neutral": 0, "negative": 0}

    for comment in comments:
        text = comment.get("comment_text", "")
        if not isinstance(text, str) or not text.strip():
            continue
        score = analyzer.polarity_scores(text)

        if score["compound"] >= 0.05:
            sentiments["positive"] += 1
        elif score["compound"] <= -0.05:
            sentiments["negative"] += 1
        else:
            sentiments["neutral"] += 1

    return sentiments


def generate_recommendations(df: pd.DataFrame, sentiments: Dict[str, int]) -> List[Dict[str, Any]]:
    """
    Generate actionable recommendations based on analysis.
    """
    recommendations: List[Dict[str, Any]] = []

    superfans_count = int((df["segment"] == "Superfans").sum())
    casual_count = int((df["segment"] == "Casual Listeners").sum())
    onetime_count = int((df["segment"] == "One-time Listeners").sum())

    total_sentiment = int(sum(int(v) for v in sentiments.values()))
    positive_ratio = sentiments["positive"] / total_sentiment if total_sentiment > 0 else 0.0

    if superfans_count > 0:
        recommendations.append(
            {
                "type": "engagement",
                "priority": "high",
                "text": f"You have {superfans_count} superfans. Create exclusive content or early releases for them to maintain loyalty.",
            }
        )

    if casual_count > max(1, superfans_count * 3):
        recommendations.append(
            {
                "type": "conversion",
                "priority": "medium",
                "text": f"Focus on converting {casual_count} casual listeners into superfans through consistent engagement and quality content.",
            }
        )

    if onetime_count > casual_count:
        recommendations.append(
            {
                "type": "retention",
                "priority": "high",
                "text": f"High one-time listener rate ({onetime_count}). Improve song intros and create playlists to retain first-time listeners.",
            }
        )

    if positive_ratio > 0.7:
        recommendations.append(
            {
                "type": "sentiment",
                "priority": "high",
                "text": "Your audience sentiment is highly positive (70%+)! This is the perfect time to release new content or announce shows.",
            }
        )
    elif positive_ratio < 0.5:
        recommendations.append(
            {
                "type": "sentiment",
                "priority": "medium",
                "text": "Audience sentiment is mixed. Engage with comments and consider feedback for future releases.",
            }
        )

    return recommendations


def perform_analysis(
    listeners: List[Dict[str, Any]],
    comments: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Main pipeline: combines all ML models.
    """
    if not listeners:
        raise ValueError("No listeners provided for analysis.")

    df = pd.DataFrame(listeners)

    df_clustered, cluster_stats, silhouette = perform_clustering(df)

    sentiments = analyze_sentiment(comments)

    recommendations = generate_recommendations(df_clustered, sentiments)

    insights: List[str] = [
        f"Average streams per listener: {df['total_streams'].mean():.1f}",
        f"Top 10 listeners contribute {df.nlargest(10, 'total_streams')['total_streams'].sum()} total streams",
        f"Average completion rate: {df['avg_completion_rate'].mean() * 100:.1f}%",
    ]

    segment_counts = {
        "superfans": int((df_clustered["segment"] == "Superfans").sum()),
        "casual": int((df_clustered["segment"] == "Casual Listeners").sum()),
        "onetime": int((df_clustered["segment"] == "One-time Listeners").sum()),
    }

    segment_percentages_raw = df_clustered["segment"].value_counts(normalize=True).to_dict()
    segment_percentages = {
        str(k): float(v) for k, v in segment_percentages_raw.items()
    }

    return {
        "listener_segments": segment_counts,
        "segment_percentages": segment_percentages,
        "cluster_statistics": cluster_stats.to_dict(),
        "sentiment_analysis": sentiments,
        "silhouette_score": float(silhouette),
        "recommendations": recommendations,
        "key_insights": insights,
    }

