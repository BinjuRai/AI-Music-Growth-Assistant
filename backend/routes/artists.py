from bson import ObjectId
from flask import Blueprint, jsonify

# from backend.models.database import MongoConnection
from models.database import MongoConnection
artists_bp = Blueprint("artists", __name__, url_prefix="/api/artists")


def serialize_artist(doc):
    return {
        "_id": str(doc["_id"]),
        "artist_name": doc.get("artist_name"),
        "genre": doc.get("genre"),
        "location": doc.get("location"),
        "total_followers": doc.get("total_followers"),
        "platforms": doc.get("platforms", []),
    }


@artists_bp.get("")
def get_artists():
    db = MongoConnection.get_db()
    artists = list(
        db.artists.find(
            {},
            {
                "artist_name": 1,
                "genre": 1,
                "location": 1,
            },
        )
    )
    response = [
        {
            "_id": str(a["_id"]),
            "artist_name": a.get("artist_name"),
            "genre": a.get("genre"),
            "location": a.get("location"),
        }
        for a in artists
    ]
    return jsonify(response)


@artists_bp.get("/<artist_id>")
def get_artist_detail(artist_id: str):
    db = MongoConnection.get_db()
    try:
        oid = ObjectId(artist_id)
    except Exception:
        return jsonify({"error": "Invalid artist id"}), 400

    artist = db.artists.find_one({"_id": oid})
    if not artist:
        return jsonify({"error": "Artist not found"}), 404

    return jsonify(serialize_artist(artist))
