"""
Data Fetcher Utility
Safely fetches data from MongoDB for advanced analytics
"""
import pandas as pd
from datetime import datetime, timedelta

class DataFetcher:
    """Centralized data fetching for all advanced models"""
    
    def __init__(self, db):
        self.db = db
    
    def get_listener_features(self, artist_id):
        """
        Fetch listener data with engineered features for clustering
        Uses your existing MongoDB collections
        """
        listeners = list(self.db.listeners.find({'artist_id': artist_id}))
        
        if not listeners:
            return pd.DataFrame()
        
        # Convert to DataFrame with your existing features
        df = pd.DataFrame(listeners)
        
        # Calculate features (same as your current implementation)
        df['engagement_score'] = (
            df.get('total_streams', 0) * 0.4 +
            df.get('saves', 0) * 0.3 +
            df.get('shares', 0) * 0.2 +
            df.get('completion_rate', 0) * 100 * 0.1
        )
        
        df['loyalty_score'] = (
            df.get('session_count', 0) * 0.4 +
            df.get('avg_session_duration', 0) / 60 * 0.3 +
            (100 - df.get('skip_rate', 0)) * 0.3
        )
        
        return df
    
    def get_listener_history(self, artist_id, days=90):
        """
        Fetch listener streaming history for churn prediction
        """
        cutoff_date = datetime.now() - timedelta(days=days)
        
        history = list(self.db.streaming_history.find({
            'artist_id': artist_id,
            'timestamp': {'$gte': cutoff_date}
        }))
        
        return pd.DataFrame(history)
    
    def get_comments_and_reviews(self, artist_id):
        """
        Fetch text data for sentiment/emotion analysis
        """
        comments = list(self.db.comments.find({'artist_id': artist_id}))
        reviews = list(self.db.reviews.find({'artist_id': artist_id}))
        
        # Combine all text
        all_text = []
        for comment in comments:
            all_text.append({
                'text': comment.get('text', ''),
                'type': 'comment',
                'timestamp': comment.get('timestamp')
            })
        
        for review in reviews:
            all_text.append({
                'text': review.get('text', ''),
                'type': 'review',
                'timestamp': review.get('timestamp')
            })
        
        return pd.DataFrame(all_text)
    
    def prepare_churn_features(self, artist_id):
        """
        Engineer features specifically for churn prediction
        """
        listeners = self.get_listener_features(artist_id)
        history = self.get_listener_history(artist_id)
        
        if listeners.empty or history.empty:
            return pd.DataFrame()
        
        # Group history by listener
        history_grouped = history.groupby('listener_id').agg({
            'timestamp': ['max', 'count'],
            'streams': 'sum',
            'skip_rate': 'mean'
        }).reset_index()
        
        # Flatten column names
        history_grouped.columns = [
            'listener_id', 'last_stream_date', 'stream_sessions',
            'total_streams', 'avg_skip_rate'
        ]
        
        # Calculate days since last stream
        history_grouped['days_since_last_stream'] = (
            datetime.now() - pd.to_datetime(history_grouped['last_stream_date'])
        ).dt.days
        
        # Merge with listener features
        churn_data = listeners.merge(
            history_grouped, 
            left_on='listener_id', 
            right_on='listener_id',
            how='left'
        )
        
        # Fill NaN for new listeners
        churn_data['days_since_last_stream'].fillna(0, inplace=True)
        churn_data['stream_sessions'].fillna(1, inplace=True)
        
        # Calculate declining trend (comparing last 30 vs previous 30 days)
        churn_data['declining_trend'] = self._calculate_trend(history, churn_data)
        
        return churn_data
    
    def _calculate_trend(self, history, churn_data):
        """Helper to calculate if listener engagement is declining"""
        trends = []
        
        for _, listener in churn_data.iterrows():
            listener_history = history[history['listener_id'] == listener['listener_id']]
            
            if len(listener_history) < 2:
                trends.append(0)  # Not enough data
                continue
            
            # Split into recent vs older
            listener_history = listener_history.sort_values('timestamp')
            midpoint = len(listener_history) // 2
            
            recent_streams = listener_history.iloc[midpoint:]['streams'].sum()
            older_streams = listener_history.iloc[:midpoint]['streams'].sum()
            
            # Negative trend = declining
            trend = (recent_streams - older_streams) / (older_streams + 1)
            trends.append(trend)
        
        return trends