"""
Data Fetcher for New/Emerging Artists
Extends base DataFetcher with new artist specific methods
"""
import pandas as pd
from datetime import datetime, timedelta
from bson import ObjectId

class NewArtistDataFetcher:
    """Data fetching specifically for emerging artists in growth program"""
    
    def __init__(self, db):
        self.db = db
    
    def get_new_artist_listener_features(self, artist_id):
        """
        Fetch listener data for a new artist
        Note: New artists might have limited data, so we handle that gracefully
        """
        # For new artists, we might not have full listener profiles yet
        # So we synthesize from growth_tracking data
        
        tracking_history = list(
            self.db.growth_tracking.find({'artist_id': ObjectId(artist_id)})
            .sort('tracking_date', 1)
        )
        
        if not tracking_history:
            return pd.DataFrame()
        
        # Create synthetic listener features from aggregate metrics
        listeners_data = []
        
        for track in tracking_history:
            metrics = track['metrics']
            
            # Estimate listener segments based on engagement patterns
            total_listeners = metrics.get('followers', 0)
            engagement_rate = metrics.get('engagement_rate', 0.05)
            
            # Estimate superfans (high engagement)
            superfans = int(total_listeners * engagement_rate)
            
            # Estimate casual (medium engagement)  
            casual = int(total_listeners * 0.3)
            
            # Rest are one-time
            onetime = total_listeners - superfans - casual
            
            # Create listener rows
            if superfans > 0:
                listeners_data.append({
                    'segment': 'superfan',
                    'count': superfans,
                    'engagement_score': 8.5,
                    'loyalty_score': 9.0,
                    'avg_streams': metrics.get('streams', 0) / max(total_listeners, 1) * 1.5
                })
            
            if casual > 0:
                listeners_data.append({
                    'segment': 'casual',
                    'count': casual,
                    'engagement_score': 5.2,
                    'loyalty_score': 4.8,
                    'avg_streams': metrics.get('streams', 0) / max(total_listeners, 1)
                })
            
            if onetime > 0:
                listeners_data.append({
                    'segment': 'onetime',
                    'count': onetime,
                    'engagement_score': 2.1,
                    'loyalty_score': 1.5,
                    'avg_streams': metrics.get('streams', 0) / max(total_listeners, 1) * 0.3
                })
        
        return pd.DataFrame(listeners_data)
    
    def get_new_artist_growth_trajectory(self, artist_id):
        """
        Get growth data over time for trend analysis
        """
        tracking = list(
            self.db.growth_tracking.find({'artist_id': ObjectId(artist_id)})
            .sort('tracking_date', 1)
        )
        
        trajectory = []
        for track in tracking:
            trajectory.append({
                'date': track['tracking_date'],
                'followers': track['metrics'].get('followers', 0),
                'streams': track['metrics'].get('streams', 0),
                'engagement_rate': track['metrics'].get('engagement_rate', 0),
                'progress_score': track.get('progress_score', 0)
            })
        
        return pd.DataFrame(trajectory)
    
    def prepare_new_artist_churn_features(self, artist_id):
        """
        Prepare churn features specifically for new artists
        Focus on early supporter retention
        """
        trajectory = self.get_new_artist_growth_trajectory(artist_id)
        
        if trajectory.empty or len(trajectory) < 2:
            return pd.DataFrame()
        
        # Calculate week-over-week changes
        trajectory['follower_growth'] = trajectory['followers'].diff()
        trajectory['stream_growth'] = trajectory['streams'].diff()
        trajectory['engagement_trend'] = trajectory['engagement_rate'].diff()
        
        # Identify declining trends (churn risk indicators)
        churn_features = []
        
        for idx, row in trajectory.iterrows():
            if idx == 0:
                continue  # Skip first row (no diff data)
            
            # Churn risk is high if:
            # 1. Follower growth is slowing or negative
            # 2. Engagement rate is declining
            # 3. Stream growth is below expectation
            
            follower_trend = row['follower_growth'] if pd.notna(row['follower_growth']) else 0
            engagement_trend = row['engagement_trend'] if pd.notna(row['engagement_trend']) else 0
            stream_trend = row['stream_growth'] if pd.notna(row['stream_growth']) else 0
            
            churn_risk_score = 0
            
            # Negative follower growth = high risk
            if follower_trend < 0:
                churn_risk_score += 0.4
            elif follower_trend < 10:  # Stagnant growth
                churn_risk_score += 0.2
            
            # Declining engagement = high risk
            if engagement_trend < 0:
                churn_risk_score += 0.3
            
            # Declining streams = medium risk
            if stream_trend < 0:
                churn_risk_score += 0.3
            
            churn_features.append({
                'date': row['date'],
                'followers': row['followers'],
                'follower_growth_rate': follower_trend,
                'engagement_rate': row['engagement_rate'],
                'engagement_trend': engagement_trend,
                'churn_risk_score': min(churn_risk_score, 1.0),
                'is_at_risk': churn_risk_score > 0.5
            })
        
        return pd.DataFrame(churn_features)
    
    def get_new_artist_feedback_text(self, artist_id):
        """
        Get text feedback/comments for emotion analysis
        For new artists, this might come from:
        - Direct messages
        - Social media comments
        - Recommendation feedback
        """
        # Get recommendation feedback
        recommendations = list(
            self.db.growth_recommendations.find({
                'artist_id': ObjectId(artist_id),
                'status': 'completed',
                'artist_feedback': {'$exists': True}
            })
        )
        
        feedback_texts = []
        
        for rec in recommendations:
            if 'artist_feedback' in rec:
                feedback_texts.append({
                    'text': rec['artist_feedback'],
                    'type': 'recommendation_feedback',
                    'date': rec.get('completed_date', datetime.now())
                })
        
        # Get milestone celebration notes (often emotional)
        tracking_with_notes = list(
            self.db.growth_tracking.find({
                'artist_id': ObjectId(artist_id),
                'notes': {'$exists': True, '$ne': ''}
            })
        )
        
        for track in tracking_with_notes:
            feedback_texts.append({
                'text': track['notes'],
                'type': 'progress_note',
                'date': datetime.strptime(track['tracking_date'], '%Y-%m-%d')
            })
        
        # Add milestone descriptions (inherently emotional)
        for track in self.db.growth_tracking.find({'artist_id': ObjectId(artist_id)}):
            if 'milestones_hit' in track and track['milestones_hit']:
                for milestone in track['milestones_hit']:
                    feedback_texts.append({
                        'text': f"Achievement: {milestone}",
                        'type': 'milestone',
                        'date': datetime.strptime(track['tracking_date'], '%Y-%m-%d')
                    })
        
        return pd.DataFrame(feedback_texts)
    
    def get_artist_context(self, artist_id):
        """
        Get full artist context for analysis
        """
        artist = self.db.new_artists.find_one({'_id': ObjectId(artist_id)})
        
        if not artist:
            return None
        
        return {
            'artist_id': str(artist['_id']),
            'artist_name': artist['artist_name'],
            'genre': artist['genre'],
            'location': artist['location'],
            'days_active': (datetime.now() - artist['onboarding_date']).days,
            'current_status': artist.get('status', 'onboarding'),
            'goals': artist.get('goals', {})
        }