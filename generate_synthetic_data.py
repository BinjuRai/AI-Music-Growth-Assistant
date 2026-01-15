# import csv
# import random
# from datetime import datetime, timedelta
# from pathlib import Path
# from typing import List


# ARTISTS_COUNT_MIN = 50
# ARTISTS_COUNT_MAX = 100

# LISTENERS_PER_ARTIST = 500
# COMMENTS_PER_ARTIST = 100
# ENGAGEMENT_DAYS = 30

# OUTPUT_DIR = Path(".")


# def random_date(start: datetime, end: datetime) -> datetime:
#     """Return random datetime between start and end."""
#     delta = end - start
#     return start + timedelta(seconds=random.randint(0, int(delta.total_seconds())))


# def get_artist_names() -> list[str]:


#     """Return a curated list of Nepali female artist names, extended to required count."""
#     base_names = [
#         "Shreya Karki",
#         "Anju Panta",
#         "Melina Rai",
#         "Komal Oli",
#         "Nisha Sunar",
#         "Rina Thapa",
#         "Samjhana Lamichhane",
#         "Priya Gurung",
#         "Asmita Adhikari",
#         "Trishna Gurung",
#         "Keki Adhikari",
#         "Indira Joshi",
#         "Pramila Rai",
#         "Bimala Rai",
#         "Roshni Khatri",
#         "Sajina KC",
#         "Sandhya Shrestha",
#         "Ankita Pun",
#         "Pooja Lama",
#         "Supriya Sunar",
#         "Sushma Thapa",
#         "Muna Thapa",
#         "Rejina Rimal",
#         "Bhawana Ghimire",
#         "Saroja KC",
#         "Mamata Gurung",
#         "Kabita Nepali",
#         "Sarita Lama",
#         "Binita Rai",
#     ]
#     # If we need more, generate synthetic variations
#     suffixes = ["", " (Band)", " Project", " Official", " Live"]
#     names = []
#     i = 0
#     while len(names) < ARTISTS_COUNT_MAX and i < 500:
#         base = random.choice(base_names)
#         suffix = random.choice(suffixes)
#         candidate = f"{base}{suffix}".strip()
#         if candidate not in names:
#             names.append(candidate)
#         i += 1
#     # Ensure at least min and at most max
#     count = random.randint(ARTISTS_COUNT_MIN, ARTISTS_COUNT_MAX)
#     return names[:count]


# def generate_artists():
#     genres = ["Pop", "Folk", "Rock", "Hip-Hop"]
#     locations = ["Kathmandu", "Pokhara", "Lalitpur"]
#     platforms = ["spotify", "youtube", "instagram"]

#     artists = []
#     for idx, name in enumerate(get_artist_names(), start=1):
#         total_followers = random.randint(2000, 50000)
#         artist_platforms = random.sample(platforms, random.randint(2, 3))
#         artists.append(
#             {
#                 "artist_id": f"A{idx:04d}",
#                 "artist_name": name,
#                 "genre": random.choice(genres),
#                 "location": random.choice(locations),
#                 "total_followers": total_followers,
#                 "platforms": ",".join(artist_platforms),
#             }
#         )
#     return artists


# def generate_listeners(artists):
#     locations = ["Pokhara", "Kathmandu", "Lalitpur", "Biratnagar"]
#     listeners_rows = []
#     listener_counter = 1

#     today = datetime(2025, 1, 14)
#     start_date = today - timedelta(days=365)

#     for artist in artists:
#         for _ in range(LISTENERS_PER_ARTIST):
#             listener_id = f"L{listener_counter:05d}"
#             listener_counter += 1

#             segment_rand = random.random()
#             if segment_rand < 0.15:
#                 # Superfan
#                 total_streams = random.randint(30, 100)
#                 avg_completion_rate = round(random.uniform(0.8, 0.95), 2)
#                 skip_rate = round(random.uniform(0.05, 0.2), 2)
#                 saves = random.randint(5, 15)
#                 shares = random.randint(2, 10)
#             elif segment_rand < 0.75:
#                 # Casual
#                 total_streams = random.randint(5, 25)
#                 avg_completion_rate = round(random.uniform(0.5, 0.75), 2)
#                 skip_rate = round(random.uniform(0.2, 0.4), 2)
#                 saves = random.randint(0, 3)
#                 shares = random.randint(0, 2)
#             else:
#                 # One-time
#                 total_streams = random.randint(1, 3)
#                 avg_completion_rate = round(random.uniform(0.2, 0.5), 2)
#                 skip_rate = round(random.uniform(0.4, 0.7), 2)
#                 saves = 0
#                 shares = 0

#             comments = random.randint(0, 5)
#             listening_sessions = random.randint(1, max(1, total_streams // 2))
#             avg_session_duration = random.randint(60, 600)

#             spotify_streams = int(total_streams * random.uniform(0.4, 0.7))
#             youtube_views = max(0, total_streams - spotify_streams)
#             instagram_engagement = random.randint(0, 20)

#             first_listened_dt = random_date(start_date, today - timedelta(days=1))
#             last_listened_dt = random_date(first_listened_dt, today)

#             listeners_rows.append(
#                 {
#                     "artist_id": artist["artist_id"],
#                     "listener_id": listener_id,
#                     "total_streams": total_streams,
#                     "avg_completion_rate": avg_completion_rate,
#                     "skip_rate": skip_rate,
#                     "saves": saves,
#                     "shares": shares,
#                     "comments": comments,
#                     "listening_sessions": listening_sessions,
#                     "avg_session_duration": avg_session_duration,
#                     "spotify_streams": spotify_streams,
#                     "youtube_views": youtube_views,
#                     "instagram_engagement": instagram_engagement,
#                     "first_listened": first_listened_dt.date().isoformat(),
#                     "last_listened": last_listened_dt.date().isoformat(),
#                     "geographic_location": random.choice(locations),
#                 }
#             )

#     return listeners_rows


# def generate_comments(artists):
#     positive_comments = [
#         "Amazing voice!",
#         "Love from Pokhara!",
#         "This song touches my heart.",
#         "Your songs are on repeat!",
#         "So proud of you!",
#         "Such a soothing voice.",
#         "Love this so much!",
#         "Pure talent.",
#     ]
#     neutral_comments = [
#         "Nice.",
#         "Good song.",
#         "Not bad.",
#         "Cool.",
#         "Decent track.",
#     ]
#     negative_comments = [
#         "Could be better.",
#         "Not my style.",
#         "Did not enjoy this.",
#         "Too repetitive.",
#         "Vocals could improve.",
#     ]
#     platforms = ["youtube", "spotify", "instagram"]
#     comments_rows = []

#     today = datetime(2025, 1, 14)
#     start_date = today - timedelta(days=180)

#     for artist in artists:
#         for i in range(COMMENTS_PER_ARTIST):
#             rand = random.random()
#             if rand < 0.7:
#                 text = random.choice(positive_comments)
#             elif rand < 0.9:
#                 text = random.choice(neutral_comments)
#             else:
#                 text = random.choice(negative_comments)

#             timestamp = random_date(start_date, today)
#             listener_id = f"L{random.randint(1, LISTENERS_PER_ARTIST * len(artists)):05d}"

#             comments_rows.append(
#                 {
#                     "artist_id": artist["artist_id"],
#                     "listener_id": listener_id,
#                     "comment_text": text,
#                     "timestamp": timestamp.isoformat(),
#                     "platform": random.choice(platforms),
#                 }
#             )

#     return comments_rows


# def generate_engagement_metrics(artists):
#     platforms = ["spotify", "youtube", "instagram"]
#     engagement_rows = []
#     today = datetime(2025, 1, 14)

#     for artist in artists:
#         for day_offset in range(ENGAGEMENT_DAYS):
#             date = (today - timedelta(days=day_offset)).date().isoformat()
#             for platform in platforms:
#                 base_streams = random.randint(100, 1000)
#                 if platform == "youtube":
#                     base_streams = int(base_streams * 0.8)
#                 if platform == "instagram":
#                     base_streams = int(base_streams * 0.5)
#                 unique_listeners = int(base_streams * random.uniform(0.4, 0.8))
#                 engagement_rows.append(
#                     {
#                         "artist_id": artist["artist_id"],
#                         "date": date,
#                         "platform": platform,
#                         "total_streams": base_streams,
#                         "unique_listeners": unique_listeners,
#                         "peak_hour": random.randint(17, 22),
#                         "avg_completion_rate": round(random.uniform(0.5, 0.9), 2),
#                     }
#                 )
#     return engagement_rows


# def write_csv(filename: str, fieldnames: list[str], rows: list[dict]):
#     path = OUTPUT_DIR / filename
#     with path.open("w", newline="", encoding="utf-8") as f:
#         writer = csv.DictWriter(f, fieldnames=fieldnames)
#         writer.writeheader()
#         for row in rows:
#             writer.writerow(row)
#     print(f"Wrote {len(rows)} rows to {path}")


# def main():
#     random.seed(42)
#     OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

#     artists = generate_artists()
#     listeners = generate_listeners(artists)
#     comments = generate_comments(artists)
#     engagement = generate_engagement_metrics(artists)

#     write_csv(
#         "artists.csv",
#         ["artist_id", "artist_name", "genre", "location", "total_followers", "platforms"],
#         artists,
#     )
#     write_csv(
#         "listeners.csv",
#         [
#             "artist_id",
#             "listener_id",
#             "total_streams",
#             "avg_completion_rate",
#             "skip_rate",
#             "saves",
#             "shares",
#             "comments",
#             "listening_sessions",
#             "avg_session_duration",
#             "spotify_streams",
#             "youtube_views",
#             "instagram_engagement",
#             "first_listened",
#             "last_listened",
#             "geographic_location",
#         ],
#         listeners,
#     )
#     write_csv(
#         "comments.csv",
#         ["artist_id", "listener_id", "comment_text", "timestamp", "platform"],
#         comments,
#     )
#     write_csv(
#         "engagement_metrics.csv",
#         [
#             "artist_id",
#             "date",
#             "platform",
#             "total_streams",
#             "unique_listeners",
#             "peak_hour",
#             "avg_completion_rate",
#         ],
#         engagement,
#     )


# if __name__ == "__main__":
#     main()

import csv
import random
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict

ARTISTS_COUNT_MIN = 50
ARTISTS_COUNT_MAX = 100
LISTENERS_PER_ARTIST = 500
COMMENTS_PER_ARTIST = 100
ENGAGEMENT_DAYS = 30

OUTPUT_DIR = Path(".")


def random_date(start, end):
    delta = end - start
    return start + timedelta(seconds=random.randint(0, int(delta.total_seconds())))


def get_artist_names():
    base_names = [
        "Shreya Karki", "Anju Panta", "Melina Rai", "Komal Oli", "Nisha Sunar",
        "Rina Thapa", "Samjhana Lamichhane", "Priya Gurung", "Asmita Adhikari",
        "Trishna Gurung", "Keki Adhikari", "Indira Joshi", "Pramila Rai", "Bimala Rai",
        "Roshni Khatri", "Sajina KC", "Sandhya Shrestha", "Ankita Pun", "Pooja Lama",
        "Supriya Sunar", "Sushma Thapa", "Muna Thapa", "Rejina Rimal", "Bhawana Ghimire",
        "Saroja KC", "Mamata Gurung", "Kabita Nepali", "Sarita Lama", "Binita Rai"
    ]
    suffixes = ["", " (Band)", " Project", " Official", " Live"]

    names = []
    i = 0
    while len(names) < ARTISTS_COUNT_MAX and i < 500:
        candidate = random.choice(base_names) + random.choice(suffixes)
        candidate = candidate.strip()
        if candidate not in names:
            names.append(candidate)
        i += 1
    count = random.randint(ARTISTS_COUNT_MIN, ARTISTS_COUNT_MAX)
    return names[:count]


def generate_artists():
    genres = ["Pop", "Folk", "Rock", "Hip-Hop"]
    locations = ["Kathmandu", "Pokhara", "Lalitpur"]
    platforms = ["spotify", "youtube", "instagram"]

    artists = []
    for idx, name in enumerate(get_artist_names(), start=1):
        total_followers = random.randint(2000, 50000)
        artist_platforms = random.sample(platforms, random.randint(2, 3))
        artists.append({
            "artist_id": f"A{idx:04d}",
            "artist_name": name,
            "genre": random.choice(genres),
            "location": random.choice(locations),
            "total_followers": total_followers,
            "platforms": ",".join(artist_platforms),
            "email": f"artist{idx}@example.com"
        })
    return artists


def generate_listeners(artists):
    locations = ["Pokhara", "Kathmandu", "Lalitpur", "Biratnagar"]
    listeners_rows = []
    listener_counter = 1

    today = datetime(2025, 1, 14)
    start_date = today - timedelta(days=365)

    for artist in artists:
        for _ in range(LISTENERS_PER_ARTIST):
            listener_id = f"L{listener_counter:05d}"
            listener_counter += 1

            segment_rand = random.random()
            if segment_rand < 0.15:
                total_streams = random.randint(30, 100)
                avg_completion_rate = round(random.uniform(0.8, 0.95), 2)
                skip_rate = round(random.uniform(0.05, 0.2), 2)
                saves = random.randint(5, 15)
                shares = random.randint(2, 10)
            elif segment_rand < 0.75:
                total_streams = random.randint(5, 25)
                avg_completion_rate = round(random.uniform(0.5, 0.75), 2)
                skip_rate = round(random.uniform(0.2, 0.4), 2)
                saves = random.randint(0, 3)
                shares = random.randint(0, 2)
            else:
                total_streams = random.randint(1, 3)
                avg_completion_rate = round(random.uniform(0.2, 0.5), 2)
                skip_rate = round(random.uniform(0.4, 0.7), 2)
                saves = 0
                shares = 0

            comments = random.randint(0, 5)
            listening_sessions = random.randint(1, max(1, total_streams // 2))
            avg_session_duration = random.randint(60, 600)

            spotify_streams = int(total_streams * random.uniform(0.4, 0.7))
            youtube_views = max(0, total_streams - spotify_streams)
            instagram_engagement = random.randint(0, 20)

            first_listened_dt = random_date(start_date, today - timedelta(days=1))
            last_listened_dt = random_date(first_listened_dt, today)

            listeners_rows.append({
                "artist_id": artist["artist_id"],
                "listener_id": listener_id,
                "total_streams": total_streams,
                "avg_completion_rate": avg_completion_rate,
                "skip_rate": skip_rate,
                "saves": saves,
                "shares": shares,
                "comments": comments,
                "listening_sessions": listening_sessions,
                "avg_session_duration": avg_session_duration,
                "spotify_streams": spotify_streams,
                "youtube_views": youtube_views,
                "instagram_engagement": instagram_engagement,
                "first_listened": first_listened_dt.date().isoformat(),
                "last_listened": last_listened_dt.date().isoformat(),
                "geographic_location": random.choice(locations)
            })
    return listeners_rows


def generate_comments(artists):
    positive_comments = [
        "Amazing voice!", "Love from Pokhara!", "This song touches my heart.",
        "Your songs are on repeat!", "So proud of you!", "Such a soothing voice.",
        "Love this so much!", "Pure talent."
    ]
    neutral_comments = ["Nice.", "Good song.", "Not bad.", "Cool.", "Decent track."]
    negative_comments = [
        "Could be better.", "Not my style.", "Did not enjoy this.",
        "Too repetitive.", "Vocals could improve."
    ]
    platforms = ["youtube", "spotify", "instagram"]
    comments_rows = []

    today = datetime(2025, 1, 14)
    start_date = today - timedelta(days=180)

    for artist in artists:
        for _ in range(COMMENTS_PER_ARTIST):
            rand = random.random()
            if rand < 0.7:
                text = random.choice(positive_comments)
            elif rand < 0.9:
                text = random.choice(neutral_comments)
            else:
                text = random.choice(negative_comments)

            timestamp = random_date(start_date, today)
            listener_id = f"L{random.randint(1, LISTENERS_PER_ARTIST * len(artists)):05d}"

            comments_rows.append({
                "artist_id": artist["artist_id"],
                "listener_id": listener_id,
                "comment_text": text,
                "timestamp": timestamp.isoformat(),
                "platform": random.choice(platforms)
            })
    return comments_rows


def generate_engagement_metrics(artists):
    platforms = ["spotify", "youtube", "instagram"]
    engagement_rows = []
    today = datetime(2025, 1, 14)

    for artist in artists:
        for day_offset in range(ENGAGEMENT_DAYS):
            date = (today - timedelta(days=day_offset)).date().isoformat()
            for platform in platforms:
                base_streams = random.randint(100, 1000)
                if platform == "youtube":
                    base_streams = int(base_streams * 0.8)
                if platform == "instagram":
                    base_streams = int(base_streams * 0.5)

                unique_listeners = int(base_streams * random.uniform(0.4, 0.8))
                engagement_rows.append({
                    "artist_id": artist["artist_id"],
                    "date": date,
                    "platform": platform,
                    "total_streams": base_streams,
                    "unique_listeners": unique_listeners,
                    "peak_hour": random.randint(17, 22),
                    "avg_completion_rate": round(random.uniform(0.5, 0.9), 2)
                })
    return engagement_rows


def write_csv(filename, fieldnames, rows):
    path = OUTPUT_DIR / filename
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            # Only write keys present in fieldnames
            filtered_row = {k: v for k, v in row.items() if k in fieldnames}
            writer.writerow(filtered_row)
    print(f"Wrote {len(rows)} rows to {path}")


def main():
    random.seed(42)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    artists = generate_artists()
    listeners = generate_listeners(artists)
    comments = generate_comments(artists)
    engagement = generate_engagement_metrics(artists)

    write_csv(
        "artists.csv",
        ["artist_id", "artist_name", "genre", "location", "total_followers", "platforms", "email"],
        artists
    )
    write_csv(
        "listeners.csv",
        [
            "artist_id", "listener_id", "total_streams", "avg_completion_rate", "skip_rate",
            "saves", "shares", "comments", "listening_sessions", "avg_session_duration",
            "spotify_streams", "youtube_views", "instagram_engagement",
            "first_listened", "last_listened", "geographic_location"
        ],
        listeners
    )
    write_csv(
        "comments.csv",
        ["artist_id", "listener_id", "comment_text", "timestamp", "platform"],
        comments
    )
    write_csv(
        "engagement_metrics.csv",
        ["artist_id", "date", "platform", "total_streams", "unique_listeners", "peak_hour", "avg_completion_rate"],
        engagement
    )


if __name__ == "__main__":
    main()
