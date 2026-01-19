# from flask import Flask, jsonify
# from flask_cors import CORS

# # from backend.config import config
# # from backend.routes.analytics import analytics_bp
# # from backend.routes.artists import artists_bp
# from .config import config
# from .routes.analytics import analytics_bp

# def create_app() -> Flask:
#     app = Flask(__name__)
#     app.config["JSON_SORT_KEYS"] = False
#     CORS(app)

#     app.register_blueprint(artists_bp)
#     app.register_blueprint(analytics_bp)

#     @app.get("/api/health")
#     def health():
#         return jsonify({"status": "ok"})

#     return app


# if __name__ == "__main__":
#     app = create_app()
#     app.run(host="0.0.0.0", port=5000, debug=config.DEBUG)




# from flask import Flask, jsonify
# from flask_cors import CORS

# from backend.config import config            # <- fully qualified
# from .routes.analytics import analytics_bp  # <- relative import works
# from .routes.artists import artists_bp  


# def create_app() -> Flask:
#     app = Flask(__name__)
#     app.config["JSON_SORT_KEYS"] = False
#     CORS(app)

#     # Register Blueprints
#     app.register_blueprint(artists_bp)
#     app.register_blueprint(analytics_bp)

#     @app.get("/api/health")
#     def health():
#         return jsonify({"status": "ok"})

#     return app



# if __name__ == "__main__":
#     app = create_app()
#     app.run(host="0.0.0.0", port=5001, debug=config.DEBUG)


# import pandas as pd
# from bson import ObjectId
# from datetime import datetime


# # from models.database import MongoConnection
# from config import config

# # from backend.models.database import MongoConnection


# def find_mentor_match(genre, location):
#     """Find successful artist with similar profile"""
#     db = MongoConnection.get_db()
    
#     successful = db.artists.find_one({
#         'genre': genre,
#         'location': location,
#         'total_followers': {'$gte': 5000}
#     })
    
#     if not successful:
#         successful = db.artists.find_one({'genre': genre})
    
#     return successful['_id'] if successful else None


# def generate_initial_recommendations(artist):
#     """Generate first set of recommendations based on current state"""
#     db = MongoConnection.get_db()
#     recommendations = []
    
#     current_platforms = len(artist['current_metrics']['platforms'])
    
#     # Recommendation 1: Platform expansion
#     if current_platforms < 2:
#         rec = {
#             'artist_id': artist['_id'],
#             'type': 'platform',
#             'priority': 'critical',
#             'title': 'Expand Your Platform Presence',
#             'description': f'You are currently on {current_platforms} platform(s). Successful {artist["genre"]} artists use 2-3 platforms.',
#             'action_steps': [
#                 'Create Spotify artist profile',
#                 'Upload 3-5 quality tracks',
#                 'Optimize your profile with bio and photos',
#                 'Submit to playlist curators'
#             ],
#             'expected_impact': 'Reach 200-500 new listeners in first month',
#             'ml_confidence': 0.85,
#             'created_at': datetime.now(),
#             'status': 'pending'
#         }
#         recommendations.append(rec)
#         db.growth_recommendations.insert_one(rec.copy())
    
#     # Recommendation 2: Content consistency
#     rec = {
#         'artist_id': artist['_id'],
#         'type': 'content',
#         'priority': 'high',
#         'title': 'Create a Release Schedule',
#         'description': 'Consistency is key. Successful artists release new content 2-4 times per month.',
#         'action_steps': [
#             'Create a content calendar',
#             'Plan bi-weekly releases',
#             'Mix full songs with covers or acoustic versions',
#             'Batch record to stay consistent'
#         ],
#         'expected_impact': 'Increase retention by 40-60%',
#         'ml_confidence': 0.92,
#         'created_at': datetime.now(),
#         'status': 'pending'
#     }
#     recommendations.append(rec)
#     db.growth_recommendations.insert_one(rec.copy())
    
#     # Recommendation 3: Build superfans
#     rec = {
#         'artist_id': artist['_id'],
#         'type': 'engagement',
#         'priority': 'high',
#         'title': 'Build Your Core Superfan Base',
#         'description': 'Focus on converting your first 50-100 listeners into superfans.',
#         'action_steps': [
#             'Reply to every comment',
#             'Create exclusive content for early supporters',
#             'Start a WhatsApp/Telegram group',
#             'Go live weekly on Instagram/YouTube'
#         ],
#         'expected_impact': 'Each superfan brings 3-5 new listeners',
#         'ml_confidence': 0.88,
#         'created_at': datetime.now(),
#         'status': 'pending'
#     }
#     recommendations.append(rec)
#     db.growth_recommendations.insert_one(rec.copy())
    
#     # Remove _id from response (MongoDB adds it automatically)
#     for r in recommendations:
#         if '_id' in r:
#             r['_id'] = str(r['_id'])
#         r['artist_id'] = str(r['artist_id'])
    
#     return recommendations


# def calculate_progress_score(artist_id, current_metrics):
#     """Calculate progress score 0-1"""
#     db = MongoConnection.get_db()
#     artist = db.new_artists.find_one({'_id': ObjectId(artist_id)})
    
#     if not artist:
#         return 0.0
    
#     goals = artist['goals']
    
#     follower_progress = min(
#         current_metrics.get('followers', 0) / goals.get('target_followers', 1), 
#         1.0
#     )
#     stream_progress = min(
#         current_metrics.get('streams', 0) / goals.get('target_monthly_streams', 1), 
#         1.0
#     )
    
#     return round((follower_progress * 0.5 + stream_progress * 0.5), 2)


# def calculate_goal_progress(artist, tracking_history):
#     """Calculate detailed progress toward goals"""
#     if not tracking_history:
#         return {
#             'followers': {
#                 'current': 0, 
#                 'target': artist['goals']['target_followers'], 
#                 'percentage': 0
#             },
#             'streams': {
#                 'current': 0, 
#                 'target': artist['goals']['target_monthly_streams'], 
#                 'percentage': 0
#             }
#         }
    
#     latest = tracking_history[0]['metrics']
    
#     return {
#         'followers': {
#             'current': latest.get('followers', 0),
#             'target': artist['goals']['target_followers'],
#             'percentage': min(
#                 (latest.get('followers', 0) / artist['goals']['target_followers']) * 100, 
#                 100
#             )
#         },
#         'streams': {
#             'current': latest.get('streams', 0),
#             'target': artist['goals']['target_monthly_streams'],
#             'percentage': min(
#                 (latest.get('streams', 0) / artist['goals']['target_monthly_streams']) * 100, 
#                 100
#             )
#         }
#     }
from flask import Flask, jsonify
from flask_cors import CORS

import pandas as pd
from bson import ObjectId
from datetime import datetime

from config import config
from routes.analytics import analytics_bp      # <- ADD THIS
from routes.artists import artists_bp          # <- ADD THIS
from routes.growth import growth_bp            # <- ADD THIS
from routes.advanced.advanced_analytics import advanced_bp, init_advanced_models

def create_app() -> Flask:
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False
    CORS(app)

    # Register Blueprints
    app.register_blueprint(artists_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(growth_bp)
    app.register_blueprint(advanced_bp)

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})
    

    print("🚀 Initializing advanced analytics models...")
    init_advanced_models()

    return app
    

if __name__ == "__main__":
    app = create_app()
    
    print("🚀 Starting Flask server on http://localhost:5001")
    app.run(host="0.0.0.0", port=5001, debug=True)