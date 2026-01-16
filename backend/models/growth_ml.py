# import pandas as pd
# from bson import ObjectId
# from datetime import datetime

# def find_mentor_match(genre, location):
#     """Find successful artist with similar profile"""
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
#         db.growth_recommendations.insert_one(rec)
    
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
#     db.growth_recommendations.insert_one(rec)
    
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
#     db.growth_recommendations.insert_one(rec)
    
#     return recommendations

# def calculate_progress_score(artist_id, current_metrics):
#     """Calculate progress score 0-1"""
#     artist = db.new_artists.find_one({'_id': ObjectId(artist_id)})
#     goals = artist['goals']
    
#     follower_progress = min(current_metrics['followers'] / goals['target_followers'], 1.0)
#     stream_progress = min(current_metrics['streams'] / goals['target_monthly_streams'], 1.0)
    
#     return (follower_progress * 0.5 + stream_progress * 0.5)

# def calculate_goal_progress(artist, tracking_history):
#     """Calculate detailed progress toward goals"""
#     if not tracking_history:
#         return {
#             'followers': {'current': 0, 'target': artist['goals']['target_followers'], 'percentage': 0},
#             'streams': {'current': 0, 'target': artist['goals']['target_monthly_streams'], 'percentage': 0}
#         }
    
#     latest = tracking_history[0]['metrics']
    
#     return {
#         'followers': {
#             'current': latest['followers'],
#             'target': artist['goals']['target_followers'],
#             'percentage': min((latest['followers'] / artist['goals']['target_followers']) * 100, 100)
#         },
#         'streams': {
#             'current': latest['streams'],
#             'target': artist['goals']['target_monthly_streams'],
#             'percentage': min((latest['streams'] / artist['goals']['target_monthly_streams']) * 100, 100)
#         }
#     }
# import pandas as pd
# from bson import ObjectId
# from datetime import datetime

# from backend.models.database import MongoConnection

import pandas as pd
from bson import ObjectId
from datetime import datetime

from models.database import MongoConnection

def find_mentor_match(genre, location):
    """Find successful artist with similar profile"""
    db = MongoConnection.get_db()
    
    successful = db.artists.find_one({
        'genre': genre,
        'location': location,
        'total_followers': {'$gte': 5000}
    })
    
    if not successful:
        successful = db.artists.find_one({'genre': genre})
    
    return successful['_id'] if successful else None


def generate_initial_recommendations(artist):
    """Generate first set of recommendations based on current state"""
    db = MongoConnection.get_db()
    recommendations = []
    
    current_platforms = len(artist['current_metrics']['platforms'])
    
    # Recommendation 1: Platform expansion
    if current_platforms < 2:
        rec = {
            'artist_id': artist['_id'],
            'type': 'platform',
            'priority': 'critical',
            'title': 'Expand Your Platform Presence',
            'description': f'You are currently on {current_platforms} platform(s). Successful {artist["genre"]} artists use 2-3 platforms.',
            'action_steps': [
                'Create Spotify artist profile',
                'Upload 3-5 quality tracks',
                'Optimize your profile with bio and photos',
                'Submit to playlist curators'
            ],
            'expected_impact': 'Reach 200-500 new listeners in first month',
            'ml_confidence': 0.85,
            'created_at': datetime.now(),
            'status': 'pending'
        }
        recommendations.append(rec)
        db.growth_recommendations.insert_one(rec.copy())
    
    # Recommendation 2: Content consistency
    rec = {
        'artist_id': artist['_id'],
        'type': 'content',
        'priority': 'high',
        'title': 'Create a Release Schedule',
        'description': 'Consistency is key. Successful artists release new content 2-4 times per month.',
        'action_steps': [
            'Create a content calendar',
            'Plan bi-weekly releases',
            'Mix full songs with covers or acoustic versions',
            'Batch record to stay consistent'
        ],
        'expected_impact': 'Increase retention by 40-60%',
        'ml_confidence': 0.92,
        'created_at': datetime.now(),
        'status': 'pending'
    }
    recommendations.append(rec)
    db.growth_recommendations.insert_one(rec.copy())
    
    # Recommendation 3: Build superfans
    rec = {
        'artist_id': artist['_id'],
        'type': 'engagement',
        'priority': 'high',
        'title': 'Build Your Core Superfan Base',
        'description': 'Focus on converting your first 50-100 listeners into superfans.',
        'action_steps': [
            'Reply to every comment',
            'Create exclusive content for early supporters',
            'Start a WhatsApp/Telegram group',
            'Go live weekly on Instagram/YouTube'
        ],
        'expected_impact': 'Each superfan brings 3-5 new listeners',
        'ml_confidence': 0.88,
        'created_at': datetime.now(),
        'status': 'pending'
    }
    recommendations.append(rec)
    db.growth_recommendations.insert_one(rec.copy())
    
    # Remove _id from response (MongoDB adds it automatically)
    for r in recommendations:
        if '_id' in r:
            r['_id'] = str(r['_id'])
        r['artist_id'] = str(r['artist_id'])
    
    return recommendations


def calculate_progress_score(artist_id, current_metrics):
    """Calculate progress score 0-1"""
    db = MongoConnection.get_db()
    artist = db.new_artists.find_one({'_id': ObjectId(artist_id)})
    
    if not artist:
        return 0.0
    
    goals = artist['goals']
    
    follower_progress = min(
        current_metrics.get('followers', 0) / goals.get('target_followers', 1), 
        1.0
    )
    stream_progress = min(
        current_metrics.get('streams', 0) / goals.get('target_monthly_streams', 1), 
        1.0
    )
    
    return round((follower_progress * 0.5 + stream_progress * 0.5), 2)


def calculate_goal_progress(artist, tracking_history):
    """Calculate detailed progress toward goals"""
    if not tracking_history:
        return {
            'followers': {
                'current': 0, 
                'target': artist['goals']['target_followers'], 
                'percentage': 0
            },
            'streams': {
                'current': 0, 
                'target': artist['goals']['target_monthly_streams'], 
                'percentage': 0
            }
        }
    
    latest = tracking_history[0]['metrics']
    
    return {
        'followers': {
            'current': latest.get('followers', 0),
            'target': artist['goals']['target_followers'],
            'percentage': min(
                (latest.get('followers', 0) / artist['goals']['target_followers']) * 100, 
                100
            )
        },
        'streams': {
            'current': latest.get('streams', 0),
            'target': artist['goals']['target_monthly_streams'],
            'percentage': min(
                (latest.get('streams', 0) / artist['goals']['target_monthly_streams']) * 100, 
                100
            )
        }
    }




def calculate_growth_rate(artist_id):
    """Calculate weekly growth rates based on tracking history"""
    db = MongoConnection.get_db()
    
    tracking = list(
        db.growth_tracking.find({'artist_id': ObjectId(artist_id)})
        .sort('tracking_date', 1)
        .limit(8)  # Last 8 weeks
    )
    
    if len(tracking) < 2:
        return {
            'followers_per_week': 0,
            'streams_per_week': 0
        }
    
    # Calculate differences between first and last entry
    first = tracking[0]['metrics']
    last = tracking[-1]['metrics']
    
    weeks_elapsed = len(tracking)
    
    follower_growth = (last.get('followers', 0) - first.get('followers', 0)) / weeks_elapsed
    stream_growth = (last.get('streams', 0) - first.get('streams', 0)) / weeks_elapsed
    
    return {
        'followers_per_week': round(follower_growth, 1),
        'streams_per_week': round(stream_growth, 1)
    }


def predict_days_to_goal(artist_id):
    """Estimate days to reach goal based on current growth rate"""
    db = MongoConnection.get_db()
    
    artist = db.new_artists.find_one({'_id': ObjectId(artist_id)})
    if not artist:
        return None
    
    growth_rate = calculate_growth_rate(artist_id)
    
    # Get latest metrics
    latest_tracking = db.growth_tracking.find_one(
        {'artist_id': ObjectId(artist_id)},
        sort=[('tracking_date', -1)]
    )
    
    if not latest_tracking:
        return None
    
    current_followers = latest_tracking['metrics'].get('followers', 0)
    target_followers = artist['goals']['target_followers']
    
    followers_needed = target_followers - current_followers
    
    if growth_rate['followers_per_week'] <= 0:
        return None
    
    weeks_needed = followers_needed / growth_rate['followers_per_week']
    days_needed = int(weeks_needed * 7)
    
    return max(days_needed, 0)


def detect_milestones(old_metrics, new_metrics):
    """Auto-detect when artist hits milestones"""
    milestones = []
    
    # Follower milestones
    follower_thresholds = [100, 500, 1000, 2500, 5000, 10000]
    for threshold in follower_thresholds:
        if new_metrics.get('followers', 0) >= threshold and old_metrics.get('followers', 0) < threshold:
            milestones.append({
                'type': 'follower_milestone',
                'description': f'Reached {threshold} followers!',
                'icon': '🎉'
            })
    
    # Stream milestones
    stream_thresholds = [1000, 5000, 10000, 25000, 50000]
    for threshold in stream_thresholds:
        if new_metrics.get('streams', 0) >= threshold and old_metrics.get('streams', 0) < threshold:
            milestones.append({
                'type': 'stream_milestone',
                'description': f'Hit {threshold} streams!',
                'icon': '🎵'
            })
    
    # Engagement milestone
    if new_metrics.get('engagement_rate', 0) >= 0.10 and old_metrics.get('engagement_rate', 0) < 0.10:
        milestones.append({
            'type': 'engagement_milestone',
            'description': 'Achieved 10% engagement rate!',
            'icon': '💪'
        })
    
    return milestones


def get_mentor_comparison(artist_id):
    """Compare artist with their mentor at similar stage"""
    db = MongoConnection.get_db()
    
    artist = db.new_artists.find_one({'_id': ObjectId(artist_id)})
    if not artist or not artist.get('mentor_match'):
        return None
    
    mentor = db.artists.find_one({'_id': artist['mentor_match']})
    if not mentor:
        return None
    
    # Get artist's current metrics
    latest_tracking = db.growth_tracking.find_one(
        {'artist_id': ObjectId(artist_id)},
        sort=[('tracking_date', -1)]
    )
    
    current_followers = latest_tracking['metrics'].get('followers', 0) if latest_tracking else 0
    
    return {
        'mentor_name': mentor.get('artist_name'),
        'mentor_genre': mentor.get('genre'),
        'mentor_current_followers': mentor.get('total_followers'),
        'your_followers': current_followers,
        'comparison': f"At your stage, {mentor.get('artist_name')} had around {int(mentor.get('total_followers') * 0.2)} followers"
    }