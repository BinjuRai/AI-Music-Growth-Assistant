"""
Advanced Analytics API Routes
Separate from existing /analyze endpoint - won't break current functionality
"""
from flask import Blueprint, jsonify, request
from models.advanced.clustering_models import ClusteringComparison
from models.advanced.churn_model import ChurnPredictor
from models.advanced.emotion_model import EmotionAnalyzer
from utils.data_fetcher import DataFetcher

# Create Blueprint (separate from main app routes)
advanced_bp = Blueprint('advanced', __name__, url_prefix='/api/advanced')

# Initialize models (singleton pattern)
emotion_analyzer = None
churn_predictor = ChurnPredictor()

def init_advanced_models():
    """Initialize models once (call from app.py)"""
    global emotion_analyzer
    try:
        emotion_analyzer = EmotionAnalyzer()
        print("✅ Advanced models initialized")
    except Exception as e:
        print(f"⚠️ Error initializing models: {e}")

# ============ CLUSTERING COMPARISON ============

@advanced_bp.route('/clustering-comparison/<artist_id>', methods=['GET'])
def clustering_comparison(artist_id):
    """
    Compare K-Means with alternative clustering algorithms
    
    Usage: GET /api/advanced/clustering-comparison/artist_123
    """
    try:
        from app import db  # Import db from main app
        
        # Fetch data
        data_fetcher = DataFetcher(db)
        listener_data = data_fetcher.get_listener_features(artist_id)
        
        if listener_data.empty:
            return jsonify({
                'error': 'No listener data found for this artist'
            }), 404
        
        # Run comparison
        clustering = ClusteringComparison(n_clusters=3)
        results = clustering.fit_all_models(listener_data)
        
        # Get best model recommendation
        best_model = clustering.get_best_model()
        
        # Generate comparison table for thesis
        comparison_table = clustering.generate_comparison_table()
        
        return jsonify({
            'success': True,
            'artist_id': artist_id,
            'models_compared': list(results.keys()),
            'results': results,
            'best_model': best_model,
            'comparison_table_markdown': comparison_table,
            'thesis_note': 'This comparison validates K-Means as the primary algorithm while demonstrating evaluation rigor'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Clustering comparison failed'
        }), 500


# ============ CHURN PREDICTION ============

@advanced_bp.route('/churn-prediction/<artist_id>/train', methods=['POST'])
def train_churn_model(artist_id):
    """
    Train churn prediction model for an artist
    
    Usage: POST /api/advanced/churn-prediction/artist_123/train
    """
    try:
        from app import db
        
        # Fetch churn features
        data_fetcher = DataFetcher(db)
        churn_data = data_fetcher.prepare_churn_features(artist_id)
        
        if churn_data.empty:
            return jsonify({
                'error': 'Insufficient data for churn prediction'
            }), 404
        
        # Train model
        training_results = churn_predictor.train(churn_data)
        
        if 'error' in training_results:
            return jsonify(training_results), 400
        
        return jsonify({
            'success': True,
            'artist_id': artist_id,
            'training_results': training_results,
            'model_ready': True,
            'next_step': f'Call /api/advanced/churn-prediction/{artist_id}/predict to get predictions'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Churn model training failed'
        }), 500


@advanced_bp.route('/churn-prediction/<artist_id>/predict', methods=['GET'])
def predict_churn(artist_id):
    """
    Predict churn risk for current listeners
    
    Usage: GET /api/advanced/churn-prediction/artist_123/predict
    """
    try:
        from app import db
        
        if not churn_predictor.is_trained:
            return jsonify({
                'error': 'Model not trained',
                'message': f'Train model first: POST /api/advanced/churn-prediction/{artist_id}/train'
            }), 400
        
        # Fetch current listeners
        data_fetcher = DataFetcher(db)
        churn_data = data_fetcher.prepare_churn_features(artist_id)
        
        # Predict
        predictions = churn_predictor.predict_churn_risk(churn_data)
        
        return jsonify({
            'success': True,
            'artist_id': artist_id,
            'predictions': predictions
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Churn prediction failed'
        }), 500


# ============ EMOTION ANALYSIS ============

@advanced_bp.route('/emotion-analysis/<artist_id>', methods=['GET'])
def emotion_analysis(artist_id):
    """
    Advanced emotion detection (beyond VADER)
    
    Usage: GET /api/advanced/emotion-analysis/artist_123
    """
    try:
        from app import db
        
        if not emotion_analyzer or not emotion_analyzer.model_loaded:
            return jsonify({
                'error': 'Emotion model not loaded',
                'message': 'Model may still be initializing. Try again in a moment.'
            }), 503
        
        # Fetch comments/reviews
        data_fetcher = DataFetcher(db)
        comments_df = data_fetcher.get_comments_and_reviews(artist_id)
        
        if comments_df.empty:
            return jsonify({
                'error': 'No comments or reviews found for this artist'
            }), 404
        
        # Analyze emotions
        emotion_results = emotion_analyzer.analyze_emotions(comments_df)
        
        return jsonify({
            'success': True,
            'artist_id': artist_id,
            'emotion_analysis': emotion_results
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Emotion analysis failed'
        }), 500


@advanced_bp.route('/emotion-analysis/<artist_id>/comparison', methods=['GET'])
def emotion_vader_comparison(artist_id):
    """
    Compare VADER vs Emotion Model (for thesis methodology)
    
    Usage: GET /api/advanced/emotion-analysis/artist_123/comparison
    """
    try:
        from app import db
        
        if not emotion_analyzer or not emotion_analyzer.model_loaded:
            return jsonify({'error': 'Emotion model not loaded'}), 503
        
        data_fetcher = DataFetcher(db)
        comments_df = data_fetcher.get_comments_and_reviews(artist_id)
        
        if comments_df.empty:
            return jsonify({'error': 'No text data found'}), 404
        
        # Compare methods
        comparison = emotion_analyzer.compare_with_vader(comments_df)
        
        return jsonify({
            'success': True,
            'artist_id': artist_id,
            'comparison': comparison
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============ COMBINED ADVANCED ANALYSIS ============

@advanced_bp.route('/full-analysis/<artist_id>', methods=['GET'])
def full_advanced_analysis(artist_id):
    """
    Run ALL advanced analytics in one call
    
    Usage: GET /api/advanced/full-analysis/artist_123
    """
    try:
        results = {
            'artist_id': artist_id,
            'timestamp': str(pd.Timestamp.now()),
            'analyses': {}
        }
        
        # 1. Clustering Comparison
        try:
            clustering_response = clustering_comparison(artist_id)
            if clustering_response[1] == 200:  # Success
                results['analyses']['clustering'] = clustering_response[0].json
        except:
            results['analyses']['clustering'] = {'skipped': 'Error occurred'}
        
        # 2. Emotion Analysis
        try:
            emotion_response = emotion_analysis(artist_id)
            if emotion_response[1] == 200:
                results['analyses']['emotions'] = emotion_response[0].json
        except:
            results['analyses']['emotions'] = {'skipped': 'Error occurred'}
        
        # 3. Churn Prediction (if model is trained)
        try:
            if churn_predictor.is_trained:
                churn_response = predict_churn(artist_id)
                if churn_response[1] == 200:
                    results['analyses']['churn'] = churn_response[0].json
            else:
                results['analyses']['churn'] = {'note': 'Model needs training first'}
        except:
            results['analyses']['churn'] = {'skipped': 'Error occurred'}
        
        return jsonify({
            'success': True,
            'complete_analysis': results
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    