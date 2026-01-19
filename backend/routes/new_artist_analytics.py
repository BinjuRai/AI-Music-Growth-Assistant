"""
Advanced Analytics for New/Emerging Artists
Separate routes that won't interfere with existing growth tracking
"""
from flask import Blueprint, jsonify
from bson import ObjectId
from models.advanced.clustering_models import ClusteringComparison
from models.advanced.churn_model import ChurnPredictor
from models.advanced.emotion_model import EmotionAnalyzer
from utils.new_artist_data_fetcher import NewArtistDataFetcher

new_artist_advanced_bp = Blueprint('new_artist_advanced', __name__, url_prefix='/api/new-artists/advanced')

# Initialize models (shared with main analytics)
emotion_analyzer_new = None
churn_predictor_new = ChurnPredictor()

def init_new_artist_models():
    """Initialize models for new artists"""
    global emotion_analyzer_new
    try:
        from models.advanced.emotion_model import EmotionAnalyzer
        emotion_analyzer_new = EmotionAnalyzer()
        print("✅ New artist advanced models initialized")
    except Exception as e:
        print(f"⚠️ Could not load new artist models: {e}")


# ============ CLUSTERING ANALYSIS FOR NEW ARTISTS ============

@new_artist_advanced_bp.route('/<artist_id>/audience-segmentation', methods=['GET'])
def analyze_audience_segments(artist_id):
    """
    Analyze how new artist's audience is segmented
    Tracks evolution from early supporters to diverse audience
    """
    try:
        from app import db
        
        data_fetcher = NewArtistDataFetcher(db)
        context = data_fetcher.get_artist_context(artist_id)
        
        if not context:
            return jsonify({'error': 'Artist not found'}), 404
        
        # Get listener features
        listener_data = data_fetcher.get_new_artist_listener_features(artist_id)
        
        if listener_data.empty:
            return jsonify({
                'error': 'Insufficient data',
                'message': 'Need at least 2 progress updates to analyze audience segments',
                'recommendation': 'Keep tracking your progress and try again after a few updates'
            }), 400
        
        # Run clustering comparison
        clustering = ClusteringComparison(n_clusters=3)
        
        # Prepare features for clustering
        features_df = pd.DataFrame({
            'engagement_score': listener_data['engagement_score'],
            'loyalty_score': listener_data['loyalty_score']
        })
        
        results = clustering.fit_all_models(features_df)
        best_model = clustering.get_best_model()
        
        # Add new artist specific insights
        insights = {
            'stage': 'early' if context['days_active'] < 30 else 'growing' if context['days_active'] < 90 else 'established',
            'primary_segment': 'superfans' if listener_data['segment'].value_counts().idxmax() == 'superfan' else 'casual',
            'recommendation': _generate_segment_recommendation(listener_data, context)
        }
        
        return jsonify({
            'success': True,
            'artist_context': context,
            'clustering_results': results,
            'best_model': best_model,
            'insights': insights,
            'next_steps': [
                'Focus on converting casual listeners to superfans',
                'Create exclusive content for early supporters',
                'Track which segment grows fastest'
            ]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============ EARLY SUPPORTER CHURN PREDICTION ============

@new_artist_advanced_bp.route('/<artist_id>/supporter-retention', methods=['GET'])
def predict_supporter_retention(artist_id):
    """
    Predict risk of losing early supporters (critical for new artists)
    Early churn is more damaging than later churn
    """
    try:
        from app import db
        
        data_fetcher = NewArtistDataFetcher(db)
        context = data_fetcher.get_artist_context(artist_id)
        
        if not context:
            return jsonify({'error': 'Artist not found'}), 404
        
        # Get churn features
        churn_data = data_fetcher.prepare_new_artist_churn_features(artist_id)
        
        if churn_data.empty:
            return jsonify({
                'error': 'Insufficient tracking data',
                'message': 'Need at least 3 progress updates to predict churn',
                'current_updates': len(churn_data)
            }), 400
        
        # Analyze churn risk
        at_risk_periods = churn_data[churn_data['is_at_risk'] == True]
        
        # Calculate retention health
        avg_churn_risk = churn_data['churn_risk_score'].mean()
        retention_health = 'excellent' if avg_churn_risk < 0.2 else 'good' if avg_churn_risk < 0.4 else 'concerning' if avg_churn_risk < 0.6 else 'critical'
        
        # Get current risk
        latest_risk = churn_data.iloc[-1]['churn_risk_score'] if len(churn_data) > 0 else 0
        
        return jsonify({
            'success': True,
            'artist_context': context,
            'retention_analysis': {
                'current_risk_level': float(latest_risk),
                'risk_status': 'high' if latest_risk > 0.5 else 'medium' if latest_risk > 0.3 else 'low',
                'overall_health': retention_health,
                'at_risk_periods': len(at_risk_periods),
                'trends': {
                    'follower_growth': churn_data['follower_growth_rate'].mean(),
                    'engagement_trend': churn_data['engagement_trend'].mean()
                }
            },
            'churn_risk_history': churn_data.to_dict('records'),
            'recommendations': _generate_retention_recommendations(latest_risk, churn_data, context)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============ EMOTIONAL JOURNEY ANALYSIS ============

@new_artist_advanced_bp.route('/<artist_id>/emotional-journey', methods=['GET'])
def analyze_emotional_journey(artist_id):
    """
    Track emotional journey of artist and early supporters
    This is especially meaningful for emerging artists
    """
    try:
        from app import db
        
        if not emotion_analyzer_new or not emotion_analyzer_new.model_loaded:
            return jsonify({
                'error': 'Emotion model not available',
                'message': 'Emotion analysis is currently initializing'
            }), 503
        
        data_fetcher = NewArtistDataFetcher(db)
        context = data_fetcher.get_artist_context(artist_id)
        
        if not context:
            return jsonify({'error': 'Artist not found'}), 404
        
        # Get feedback/notes text
        feedback_df = data_fetcher.get_new_artist_feedback_text(artist_id)
        
        if feedback_df.empty:
            return jsonify({
                'error': 'No emotional data available',
                'message': 'Add notes to your progress updates or complete recommendations with feedback',
                'tips': [
                    'Write how you feel in progress update notes',
                    'Share your reactions to milestones',
                    'Provide feedback when completing recommendations'
                ]
            }), 400
        
        # Analyze emotions
        emotion_results = emotion_analyzer_new.analyze_emotions(feedback_df)
        
        # Add new artist specific insights
        journey_insights = _generate_journey_insights(emotion_results, context)
        
        return jsonify({
            'success': True,
            'artist_context': context,
            'emotional_analysis': emotion_results,
            'journey_insights': journey_insights,
            'motivation_tips': _get_motivation_tips(emotion_results)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============ COMBINED GROWTH INTELLIGENCE ============

@new_artist_advanced_bp.route('/<artist_id>/growth-intelligence', methods=['GET'])
def get_growth_intelligence(artist_id):
    """
    Comprehensive ML-powered growth analysis for new artists
    Combines all three advanced features
    """
    try:
        from app import db
        
        data_fetcher = NewArtistDataFetcher(db)
        context = data_fetcher.get_artist_context(artist_id)
        
        if not context:
            return jsonify({'error': 'Artist not found'}), 404
        
        intelligence_report = {
            'artist_context': context,
            'generated_at': datetime.now().isoformat(),
            'analyses': {}
        }
        
        # 1. Audience Segmentation
        try:
            seg_response = analyze_audience_segments(artist_id)
            if seg_response[1] == 200:  # Success status code
                intelligence_report['analyses']['audience_segments'] = seg_response[0].json
        except:
            intelligence_report['analyses']['audience_segments'] = {'status': 'unavailable'}
        
        # 2. Retention Prediction
        try:
            ret_response = predict_supporter_retention(artist_id)
            if ret_response[1] == 200:
                intelligence_report['analyses']['retention'] = ret_response[0].json
        except:
            intelligence_report['analyses']['retention'] = {'status': 'unavailable'}
        
        # 3. Emotional Journey
        try:
            emo_response = analyze_emotional_journey(artist_id)
            if emo_response[1] == 200:
                intelligence_report['analyses']['emotions'] = emo_response[0].json
        except:
            intelligence_report['analyses']['emotions'] = {'status': 'unavailable'}
        
        # Generate unified insights
        intelligence_report['unified_insights'] = _generate_unified_insights(intelligence_report['analyses'])
        
        return jsonify({
            'success': True,
            'intelligence_report': intelligence_report
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============ HELPER FUNCTIONS ============

def _generate_segment_recommendation(listener_data, context):
    """Generate recommendations based on audience segmentation"""
    superfan_ratio = len(listener_data[listener_data['segment'] == 'superfan']) / len(listener_data) if len(listener_data) > 0 else 0
    
    if superfan_ratio > 0.3:
        return "Great superfan ratio! Focus on converting casual listeners to grow your base."
    elif superfan_ratio > 0.15:
        return "Healthy superfan presence. Keep engaging with them while expanding reach."
    else:
        return "Build deeper connections with current listeners before expanding reach."


def _generate_retention_recommendations(current_risk, history_df, context):
    """Generate retention recommendations"""
    recommendations = []
    
    if current_risk > 0.5:
        recommendations.append({
            'priority': 'urgent',
            'title': 'Re-engage Your Early Supporters',
            'actions': [
                'Post personal thank-you message to early followers',
                'Go live on Instagram/YouTube this week',
                'Share exclusive behind-the-scenes content',
                'Ask for feedback - make them feel heard'
            ]
        })
    
    if history_df['engagement_trend'].mean() < 0:
        recommendations.append({
            'priority': 'high',
            'title': 'Boost Engagement',
            'actions': [
                'Post consistently (3-4 times per week)',
                'Reply to every comment within 24 hours',
                'Create polls/questions in stories',
                'Host a Q&A session'
            ]
        })
    
    return recommendations


def _generate_journey_insights(emotion_results, context):
    """Generate insights about emotional journey"""
    dominant = emotion_results.get('dominant_emotion', {})
    
    insights = {
        'overall_mood': dominant.get('emotion', 'neutral'),
        'stage_appropriate': _is_emotion_stage_appropriate(dominant.get('emotion'), context),
        'motivation_level': _calculate_motivation(emotion_results)
    }
    
    return insights


def _is_emotion_stage_appropriate(emotion, context):
    """Check if emotion matches growth stage"""
    days_active = context.get('days_active', 0)
    
    # Early stage (0-30 days): Expect excitement, surprise
    if days_active < 30:
        return emotion in ['joy', 'surprise', 'love']
    
    # Growing stage (30-90 days): Expect determination, some stress
    elif days_active < 90:
        return True  # All emotions are valid during growth phase
    
    # Established (90+ days): Hope for sustained joy
    else:
        return emotion in ['joy', 'love']


def _calculate_motivation(emotion_results):
    """Calculate motivation level from emotions"""
    emotions = emotion_results.get('emotion_distribution', {})
    
    positive_score = (
        emotions.get('joy', {}).get('average_intensity', 0) +
        emotions.get('love', {}).get('average_intensity', 0) +
        emotions.get('surprise', {}).get('average_intensity', 0)
    ) / 3
    
    if positive_score > 0.7:
        return 'high'
    elif positive_score > 0.4:
        return 'moderate'
    else:
        return 'needs_boost'


def _get_motivation_tips(emotion_results):
    """Provide motivation tips based on emotional state"""
    motivation = _calculate_motivation(emotion_results)
    
    tips = {
        'high': [
            '🚀 Your energy is contagious! Keep creating.',
            '📈 This is your moment - stay consistent.',
            '💪 Channel this momentum into your next release.'
        ],
        'moderate': [
            '🎯 You\'re on the right track. Trust the process.',
            '📊 Growth takes time. Celebrate small wins.',
            '🤝 Connect with other artists for support.'
        ],
        'needs_boost': [
            '💝 Remember why you started making music.',
            '🌟 Every successful artist had tough days.',
            '🎵 Focus on creating - the numbers will follow.',
            '👥 Reach out to your mentor or support network.'
        ]
    }
    
    return tips.get(motivation, tips['moderate'])


def _generate_unified_insights(analyses):
    """Generate insights from all three analyses combined"""
    insights = []
    
    # Check if we have all three analyses
    has_segments = 'audience_segments' in analyses and analyses['audience_segments'].get('success')
    has_retention = 'retention' in analyses and analyses['retention'].get('success')
    has_emotions = 'emotions' in analyses and analyses['emotions'].get('success')
    
    if has_segments and has_retention:
        insights.append({
            'type': 'combined',
            'title': 'Audience Health Overview',
            'message': 'Your audience segmentation and retention patterns suggest focused engagement strategies.'
        })
    
    if has_emotions:
        insights.append({
            'type': 'motivation',
            'title': 'Emotional Journey',
            'message': 'Your emotional tracking shows commitment to growth - stay consistent!'
        })
    
    return insights