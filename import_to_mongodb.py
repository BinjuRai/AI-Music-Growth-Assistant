# import sys
# from pathlib import Path

# import pandas as pd
# from bson import ObjectId
# from pymongo import MongoClient


# def get_mongo_client(uri: str = "mongodb://localhost:27017/") -> MongoClient:
#     return MongoClient(uri)


# def import_data(csv_dir: Path, mongo_uri: str = "mongodb://localhost:27017/") -> None:
#     client = get_mongo_client(mongo_uri)
#     db = client["music_growth_assistant"]

#     artists_path = csv_dir / "artists.csv"
#     listeners_path = csv_dir / "listeners.csv"
#     comments_path = csv_dir / "comments.csv"
#     engagement_path = csv_dir / "engagement_metrics.csv"

#     if not artists_path.exists():
#         raise FileNotFoundError(f"{artists_path} not found")

#     print(f"Reading CSVs from {csv_dir} ...")
#     artists_df = pd.read_csv(artists_path)
#     listeners_df = pd.read_csv(listeners_path)
#     comments_df = pd.read_csv(comments_path)
#     engagement_df = pd.read_csv(engagement_path)

#     # Clear existing collections
#     db.artists.delete_many({})
#     db.listeners.delete_many({})
#     db.comments.delete_many({})
#     db.engagement_metrics.delete_many({})

#     # Insert artists and build id map from artist_id code to ObjectId
#     artist_docs = artists_df.to_dict(orient="records")
#     for doc in artist_docs:
#         doc["_artist_code"] = doc.pop("artist_id")
#         # convert platforms from CSV "a,b,c" to list
#         platforms = doc.get("platforms")
#         if isinstance(platforms, str):
#             doc["platforms"] = [p.strip() for p in platforms.split(",") if p.strip()]
#     result = db.artists.insert_many(artist_docs)
#     inserted_ids = result.inserted_ids

#     code_to_oid: dict[str, ObjectId] = {}
#     for mongo_doc, oid in zip(artist_docs, inserted_ids):
#         code = mongo_doc["_artist_code"]
#         code_to_oid[code] = oid

#     # Prepare listeners
#     listener_docs = listeners_df.to_dict(orient="records")
#     for doc in listener_docs:
#         artist_code = doc.pop("artist_id")
#         artist_oid = code_to_oid.get(artist_code)
#         if not artist_oid:
#             continue
#         doc["artist_id"] = artist_oid
#         # nested platforms object
#         doc["platforms"] = {
#             "spotify_streams": int(doc.pop("spotify_streams")),
#             "youtube_views": int(doc.pop("youtube_views")),
#             "instagram_engagement": int(doc.pop("instagram_engagement")),
#         }
#     if listener_docs:
#         db.listeners.insert_many(listener_docs)

#     # Prepare comments
#     comment_docs = comments_df.to_dict(orient="records")
#     for doc in comment_docs:
#         artist_code = doc.pop("artist_id")
#         artist_oid = code_to_oid.get(artist_code)
#         if not artist_oid:
#             continue
#         doc["artist_id"] = artist_oid
#         # timestamp already ISO string; Mongo will store as string unless converted,
#         # which is acceptable for this project. For strictness, could parse to datetime.
#     if comment_docs:
#         db.comments.insert_many(comment_docs)

#     # Prepare engagement metrics
#     engagement_docs = engagement_df.to_dict(orient="records")
#     for doc in engagement_docs:
#         artist_code = doc.pop("artist_id")
#         artist_oid = code_to_oid.get(artist_code)
#         if not artist_oid:
#             continue
#         doc["artist_id"] = artist_oid
#     if engagement_docs:
#         db.engagement_metrics.insert_many(engagement_docs)

#     print(f"Imported {db.artists.count_documents({})} artists")
#     print(f"Imported {db.listeners.count_documents({})} listeners")
#     print(f"Imported {db.comments.count_documents({})} comments")
#     print(f"Imported {db.engagement_metrics.count_documents({})} engagement metric records")


# def main():
#     csv_dir = Path(".")
#     if len(sys.argv) > 1:
#         csv_dir = Path(sys.argv[1])
#     import_data(csv_dir)


# if __name__ == "__main__":
#     main()


import sys
from pathlib import Path
from typing import Dict

import pandas as pd
from bson import ObjectId
from pymongo import MongoClient


def get_mongo_client(uri: str = "mongodb://localhost:27017/") -> MongoClient:
    return MongoClient(uri)


def import_data(csv_dir: Path, mongo_uri: str = "mongodb://localhost:27017/") -> None:
    client = get_mongo_client(mongo_uri)
    db = client["artist_growth_assistant"]

    artists_path = csv_dir / "artists.csv"
    listeners_path = csv_dir / "listeners.csv"
    comments_path = csv_dir / "comments.csv"
    engagement_path = csv_dir / "engagement_metrics.csv"

    # Validate CSV files
    for path in [artists_path, listeners_path, comments_path, engagement_path]:
        if not path.exists():
            raise FileNotFoundError(f"{path} not found")

    print(f"Reading CSVs from {csv_dir.resolve()} ...")

    artists_df = pd.read_csv(artists_path)
    listeners_df = pd.read_csv(listeners_path)
    comments_df = pd.read_csv(comments_path)
    engagement_df = pd.read_csv(engagement_path)

    # Clear existing collections
    db.artists.delete_many({})
    db.listeners.delete_many({})
    db.comments.delete_many({})
    db.engagement_metrics.delete_many({})

    # ---------- Artists ----------
    artist_docs = artists_df.to_dict(orient="records")

    for doc in artist_docs:
        doc["_artist_code"] = doc.pop("artist_id")

        platforms = doc.get("platforms")
        if isinstance(platforms, str):
            doc["platforms"] = [p.strip() for p in platforms.split(",") if p.strip()]

    result = db.artists.insert_many(artist_docs)
    inserted_ids = result.inserted_ids

    code_to_oid: Dict[str, ObjectId] = {}
    for mongo_doc, oid in zip(artist_docs, inserted_ids):
        code_to_oid[mongo_doc["_artist_code"]] = oid

    # ---------- Listeners ----------
    listener_docs = []
    for doc in listeners_df.to_dict(orient="records"):
        artist_code = doc.pop("artist_id")
        artist_oid = code_to_oid.get(artist_code)
        if not artist_oid:
            continue

        doc["artist_id"] = artist_oid
        doc["platforms"] = {
            "spotify_streams": int(doc.pop("spotify_streams")),
            "youtube_views": int(doc.pop("youtube_views")),
            "instagram_engagement": int(doc.pop("instagram_engagement")),
        }
        listener_docs.append(doc)

    if listener_docs:
        db.listeners.insert_many(listener_docs)

    # ---------- Comments ----------
    comment_docs = []
    for doc in comments_df.to_dict(orient="records"):
        artist_code = doc.pop("artist_id")
        artist_oid = code_to_oid.get(artist_code)
        if not artist_oid:
            continue

        doc["artist_id"] = artist_oid
        comment_docs.append(doc)

    if comment_docs:
        db.comments.insert_many(comment_docs)

    # ---------- Engagement Metrics ----------
    engagement_docs = []
    for doc in engagement_df.to_dict(orient="records"):
        artist_code = doc.pop("artist_id")
        artist_oid = code_to_oid.get(artist_code)
        if not artist_oid:
            continue

        doc["artist_id"] = artist_oid
        engagement_docs.append(doc)

    if engagement_docs:
        db.engagement_metrics.insert_many(engagement_docs)

    # ---------- Summary ----------
    print("Import completed successfully:")
    print(f"  Artists: {db.artists.count_documents({})}")
    print(f"  Listeners: {db.listeners.count_documents({})}")
    print(f"  Comments: {db.comments.count_documents({})}")
    print(f"  Engagement records: {db.engagement_metrics.count_documents({})}")


def main() -> None:
    csv_dir = Path(".")
    if len(sys.argv) > 1:
        csv_dir = Path(sys.argv[1])

    import_data(csv_dir)


if __name__ == "__main__":
    main()
