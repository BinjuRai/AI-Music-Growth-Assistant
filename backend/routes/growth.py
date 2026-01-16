from datetime import datetime
from bson import ObjectId
from flask import Blueprint, jsonify, request

# from backend.models.database import MongoConnection
# from backend.models.growth_ml import
from models.database import MongoConnection
from models.growth_ml import (
    find_mentor_match,
    generate_initial_recommendations,
    calculate_progress_score,
    calculate_goal_progress,
    calculate_growth_rate,
    predict_days_to_goal,
    detect_milestones,
    get_mentor_comparison
)



growth_bp = Blueprint("growth", __name__, url_prefix="/api/artists")


@growth_bp.post("/onboard")
def onboard_new_artist():
    """Onboard a new artist"""
    db = MongoConnection.get_db()
    data = request.json
    
    new_artist = {
        'artist_name': data['artist_name'],
        'email': data['email'],
        'genre': data['genre'],
        'location': data['location'],
        'onboarding_date': datetime.now(),
        'current_metrics': data['current_metrics'],
        'goals': data['goals'],
        'status': 'onboarding',
        'mentor_match': find_mentor_match(data['genre'], data['location'])
    }
    
    result = db.new_artists.insert_one(new_artist)
    recommendations = generate_initial_recommendations(new_artist)
    
    return jsonify({
        'artist_id': str(result.inserted_id),
        'recommendations': recommendations
    })


# @growth_bp.post("/<artist_id>/track-progress")
# def track_progress(artist_id: str):
#     """Track artist progress"""
#     db = MongoConnection.get_db()
#     data = request.json
    
#     try:
#         oid = ObjectId(artist_id)
#     except Exception:
#         return jsonify({"error": "Invalid artist id"}), 400
    
#     tracking_entry = {
#         'artist_id': oid,
#         'tracking_date': datetime.now().strftime('%Y-%m-%d'),
#         'metrics': data['metrics'],
#         'progress_score': calculate_progress_score(artist_id, data['metrics'])
#     }
    
#     db.growth_tracking.insert_one(tracking_entry)
    
#     return jsonify({
#         'success': True, 
#         'progress_score': tracking_entry['progress_score']
#     })

@growth_bp.post("/<artist_id>/track-progress")
def track_progress(artist_id: str):
    """Track artist progress with milestone detection"""
    db = MongoConnection.get_db()
    data = request.json
    
    try:
        oid = ObjectId(artist_id)
    except Exception:
        return jsonify({"error": "Invalid artist id"}), 400
    
    # Get previous metrics for milestone detection
    previous_tracking = db.growth_tracking.find_one(
        {'artist_id': oid},
        sort=[('tracking_date', -1)]
    )
    
    old_metrics = previous_tracking['metrics'] if previous_tracking else {}
    new_metrics = data['metrics']
    
    # Detect milestones
    milestones = detect_milestones(old_metrics, new_metrics)
    
    tracking_entry = {
        'artist_id': oid,
        'tracking_date': datetime.now().strftime('%Y-%m-%d'),
        'metrics': new_metrics,
        'progress_score': calculate_progress_score(artist_id, new_metrics),
        'notes': data.get('notes', ''),
        'milestones_hit': [m['description'] for m in milestones],
        'recommendations_followed': data.get('recommendations_followed', [])
    }
    
    db.growth_tracking.insert_one(tracking_entry)
    
    # Update artist's last_updated field
    db.new_artists.update_one(
        {'_id': oid},
        {'$set': {'last_updated': datetime.now()}}
    )
    
    return jsonify({
        'success': True, 
        'progress_score': tracking_entry['progress_score'],
        'milestones_hit': milestones
    })

@growth_bp.get("/<artist_id>/growth-dashboard")
def get_growth_dashboard(artist_id: str):
    """Get growth dashboard data"""
    db = MongoConnection.get_db()
    
    try:
        oid = ObjectId(artist_id)
    except Exception:
        return jsonify({"error": "Invalid artist id"}), 400
    
    artist = db.new_artists.find_one({'_id': oid})
    if not artist:
        return jsonify({"error": "Artist not found"}), 404
    
    tracking = list(
        db.growth_tracking.find({'artist_id': oid}).sort('tracking_date', -1)
    )
    recommendations = list(
        db.growth_recommendations.find({
            'artist_id': oid, 
            'status': 'pending'
        })
    )
    
    # Serialize ObjectIds for JSON response
    artist['_id'] = str(artist['_id'])
    if artist.get('mentor_match'):
        artist['mentor_match'] = str(artist['mentor_match'])
    
    for track in tracking:
        track['_id'] = str(track['_id'])
        track['artist_id'] = str(track['artist_id'])
    
    for rec in recommendations:
        rec['_id'] = str(rec['_id'])
        rec['artist_id'] = str(rec['artist_id'])
    
    return jsonify({
        'artist': artist,
        'tracking_history': tracking,
        'recommendations': recommendations,
        'progress_to_goals': calculate_goal_progress(artist, tracking)
    })



@growth_bp.get("/<artist_id>/profile")
def get_artist_profile(artist_id: str):
    """Get complete artist profile with all data"""
    db = MongoConnection.get_db()
    
    try:
        oid = ObjectId(artist_id)
    except Exception:
        return jsonify({"error": "Invalid artist id"}), 400
    
    artist = db.new_artists.find_one({'_id': oid})
    if not artist:
        return jsonify({"error": "Artist not found"}), 404
    
    # Get latest metrics
    latest_tracking = db.growth_tracking.find_one(
        {'artist_id': oid},
        sort=[('tracking_date', -1)]
    )
    
    # Calculate growth rate and predictions
    growth_rate = calculate_growth_rate(artist_id)
    days_to_goal = predict_days_to_goal(artist_id)
    
    # Get mentor comparison
    mentor_comparison = get_mentor_comparison(artist_id)
    
    # Calculate days since onboarding
    days_since_onboarding = (datetime.now() - artist['onboarding_date']).days
    
    # Serialize
    artist['_id'] = str(artist['_id'])
    if artist.get('mentor_match'):
        artist['mentor_match'] = str(artist['mentor_match'])
    
    if latest_tracking:
        latest_tracking['_id'] = str(latest_tracking['_id'])
        latest_tracking['artist_id'] = str(latest_tracking['artist_id'])
    
    return jsonify({
        'artist': artist,
        'current_metrics': latest_tracking['metrics'] if latest_tracking else {},
        'growth_rate': growth_rate,
        'days_to_goal': days_to_goal,
        'mentor_comparison': mentor_comparison,
        'days_since_onboarding': days_since_onboarding,
        'status': artist.get('status', 'onboarding')
    })


@growth_bp.get("/<artist_id>/growth-history")
def get_growth_history(artist_id: str):
    """Get growth history for charts"""
    db = MongoConnection.get_db()
    
    try:
        oid = ObjectId(artist_id)
    except Exception:
        return jsonify({"error": "Invalid artist id"}), 400
    
    tracking = list(
        db.growth_tracking.find({'artist_id': oid})
        .sort('tracking_date', 1)
    )
    
    history = []
    for track in tracking:
        history.append({
            'date': track['tracking_date'],
            'followers': track['metrics'].get('followers', 0),
            'streams': track['metrics'].get('streams', 0),
            'engagement_rate': track['metrics'].get('engagement_rate', 0)
        })
    
    # Get milestones from tracking entries
    milestones = []
    for track in tracking:
        if 'milestones_hit' in track:
            for milestone in track['milestones_hit']:
                milestones.append({
                    'date': track['tracking_date'],
                    'description': milestone
                })
    
    return jsonify({
        'history': history,
        'milestones': milestones
    })


@growth_bp.put("/<artist_id>/update-goals")
def update_artist_goals(artist_id: str):
    """Update artist goals"""
    db = MongoConnection.get_db()
    data = request.json
    
    try:
        oid = ObjectId(artist_id)
    except Exception:
        return jsonify({"error": "Invalid artist id"}), 400
    
    artist = db.new_artists.find_one({'_id': oid})
    if not artist:
        return jsonify({"error": "Artist not found"}), 404
    
    # Update goals
    new_goals = {
        'target_followers': data.get('target_followers', 5000),
        'target_monthly_streams': data.get('target_monthly_streams', 10000),
        'timeline_months': data.get('timeline_months', 12)
    }
    
    db.new_artists.update_one(
        {'_id': oid},
        {'$set': {
            'goals': new_goals,
            'last_updated': datetime.now()
        }}
    )
    
    return jsonify({
        'success': True,
        'new_goals': new_goals
    })


@growth_bp.patch("/recommendations/<rec_id>/update-status")
def update_recommendation_status(rec_id: str):
    """Mark recommendation as in progress or completed"""
    db = MongoConnection.get_db()
    data = request.json
    
    try:
        oid = ObjectId(rec_id)
    except Exception:
        return jsonify({"error": "Invalid recommendation id"}), 400
    
    update_data = {'status': data.get('status', 'pending')}
    
    if data.get('status') == 'completed':
        update_data['completed_date'] = datetime.now()
        if 'effectiveness_score' in data:
            update_data['effectiveness_score'] = data['effectiveness_score']
        if 'feedback' in data:
            update_data['artist_feedback'] = data['feedback']
    elif data.get('status') == 'in_progress':
        update_data['started_date'] = datetime.now()
    
    db.growth_recommendations.update_one(
        {'_id': oid},
        {'$set': update_data}
    )
    
    return jsonify({'success': True})


@growth_bp.get("/<artist_id>/timeline")
def get_artist_timeline(artist_id: str):
    """Get chronological timeline of all events"""
    db = MongoConnection.get_db()
    
    try:
        oid = ObjectId(artist_id)
    except Exception:
        return jsonify({"error": "Invalid artist id"}), 400
    
    artist = db.new_artists.find_one({'_id': oid})
    if not artist:
        return jsonify({"error": "Artist not found"}), 404
    
    events = []
    
    # Onboarding event
    events.append({
        'date': artist['onboarding_date'].strftime('%Y-%m-%d'),
        'type': 'onboarded',
        'description': 'Joined the platform',
        'icon': '🎉'
    })
    
    # Progress updates
    tracking = list(db.growth_tracking.find({'artist_id': oid}).sort('tracking_date', 1))
    for track in tracking:
        events.append({
            'date': track['tracking_date'],
            'type': 'progress_update',
            'description': f"Updated progress: {track['metrics'].get('followers', 0)} followers, {track['metrics'].get('streams', 0)} streams",
            'icon': '📊'
        })
        
        # Add milestones
        if 'milestones_hit' in track:
            for milestone in track['milestones_hit']:
                events.append({
                    'date': track['tracking_date'],
                    'type': 'milestone',
                    'description': milestone,
                    'icon': '🏆'
                })
    
    # Completed recommendations
    completed_recs = list(
        db.growth_recommendations.find({
            'artist_id': oid,
            'status': 'completed'
        })
    )
    for rec in completed_recs:
        if 'completed_date' in rec:
            events.append({
                'date': rec['completed_date'].strftime('%Y-%m-%d'),
                'type': 'recommendation_completed',
                'description': f"Completed: {rec['title']}",
                'icon': '✅'
            })
    
    # Sort by date (newest first)
    events.sort(key=lambda x: x['date'], reverse=True)
    
    return jsonify({'events': events})



