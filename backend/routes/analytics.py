from bson import ObjectId
from flask import Blueprint, jsonify

from backend.models.database import MongoConnection
from backend.models.ml_models import perform_analysis

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api")


@analytics_bp.post("/analyze/<artist_id>")
def analyze_artist(artist_id: str):
    db = MongoConnection.get_db()
    try:
        oid = ObjectId(artist_id)
    except Exception:
        return jsonify({"error": "Invalid artist id"}), 400

    listeners = list(db.listeners.find({"artist_id": oid}, {"_id": 0}))
    comments = list(db.comments.find({"artist_id": oid}, {"_id": 0}))

    if not listeners:
        return jsonify({"error": "No listeners found for this artist"}), 404

    try:
        result = perform_analysis(listeners, comments)
    except Exception as exc:  # noqa: BLE001
        return jsonify({"error": "Analysis failed", "details": str(exc)}), 500

    return jsonify(result)

