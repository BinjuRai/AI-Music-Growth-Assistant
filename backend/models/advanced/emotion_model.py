"""
Advanced Emotion Analysis
Goes beyond VADER's positive/negative/neutral to detect 6 emotions
"""
from transformers import pipeline
import torch
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import numpy as np

class EmotionAnalyzer:
    """
    Multi-dimensional emotion detection
    Complements your existing VADER sentiment analysis
    """
    
    def __init__(self):
        # Check if GPU available
        device = 0 if torch.cuda.is_available() else -1
        
        print("🤖 Loading emotion detection model...")
        # Hugging Face emotion model (6 emotions)
        try:
            self.emotion_classifier = pipeline(
                "text-classification",
                model="j-hartmann/emotion-english-distilroberta-base",
                return_all_scores=True,
                device=device
            )
            self.model_loaded = True
            print("✅ Emotion model loaded successfully!")
        except Exception as e:
            print(f"⚠️ Could not load emotion model: {e}")
            self.model_loaded = False
        
        # Keep VADER for comparison
        self.vader = SentimentIntensityAnalyzer()
    
    def analyze_emotions(self, comments_df):
        """
        Analyze emotions in comments/reviews
        
        Args:
            comments_df: DataFrame with 'text' column
        
        Returns:
            dict: Emotion distribution + VADER comparison
        """
        if not self.model_loaded:
            return {'error': 'Emotion model not loaded'}
        
        if comments_df.empty or 'text' not in comments_df.columns:
            return {'error': 'No text data provided'}
        
        # Initialize emotion counters
        emotions = {
            'joy': [],
            'sadness': [],
            'anger': [],
            'fear': [],
            'surprise': [],
            'love': []
        }
        
        vader_sentiments = {
            'positive': [],
            'neutral': [],
            'negative': []
        }
        
        # Analyze each comment
        total_texts = len(comments_df)
        print(f"🔍 Analyzing {total_texts} comments for emotions...")
        
        for idx, row in comments_df.iterrows():
            text = str(row['text'])[:512]  # Truncate to model's max length
            
            if not text.strip():
                continue
            
            try:
                # Emotion detection (6 emotions)
                emotion_results = self.emotion_classifier(text)[0]
                for emotion_dict in emotion_results:
                    emotion_label = emotion_dict['label']
                    emotion_score = emotion_dict['score']
                    if emotion_label in emotions:
                        emotions[emotion_label].append(emotion_score)
                
                # VADER sentiment (for comparison)
                vader_scores = self.vader.polarity_scores(text)
                if vader_scores['compound'] >= 0.05:
                    vader_sentiments['positive'].append(vader_scores['compound'])
                elif vader_scores['compound'] <= -0.05:
                    vader_sentiments['negative'].append(vader_scores['compound'])
                else:
                    vader_sentiments['neutral'].append(vader_scores['compound'])
                
            except Exception as e:
                print(f"Error analyzing text: {e}")
                continue
        
        # Calculate averages and distributions
        emotion_summary = {}
        for emotion, scores in emotions.items():
            if scores:
                emotion_summary[emotion] = {
                    'average_intensity': float(np.mean(scores)),
                    'count': len(scores),
                    'percentage': f'{(len(scores)/total_texts)*100:.1f}%'
                }
            else:
                emotion_summary[emotion] = {
                    'average_intensity': 0.0,
                    'count': 0,
                    'percentage': '0.0%'
                }
        
        # VADER summary
        vader_summary = {
            'positive': {
                'count': len(vader_sentiments['positive']),
                'percentage': f'{(len(vader_sentiments["positive"])/total_texts)*100:.1f}%'
            },
            'neutral': {
                'count': len(vader_sentiments['neutral']),
                'percentage': f'{(len(vader_sentiments["neutral"])/total_texts)*100:.1f}%'
            },
            'negative': {
                'count': len(vader_sentiments['negative']),
                'percentage': f'{(len(vader_sentiments["negative"])/total_texts)*100:.1f}%'
            }
        }
        
        # Find dominant emotion
        dominant_emotion = max(emotion_summary.items(), key=lambda x: x[1]['count'])
        
        return {
            'analysis_complete': True,
            'total_comments_analyzed': total_texts,
            'emotion_distribution': emotion_summary,
            'vader_sentiment': vader_summary,
            'dominant_emotion': {
                'emotion': dominant_emotion[0],
                'percentage': dominant_emotion[1]['percentage'],
                'intensity': dominant_emotion[1]['average_intensity']
            },
            'insights': self._generate_emotion_insights(emotion_summary, vader_summary)
        }
    
    def _generate_emotion_insights(self, emotion_summary, vader_summary):
        """Generate actionable insights from emotion data"""
        insights = []
        
        # High joy/love = strong positive connection
        joy_pct = float(emotion_summary['joy']['percentage'].rstrip('%'))
        love_pct = float(emotion_summary['love']['percentage'].rstrip('%'))
        
        if joy_pct + love_pct > 60:
            insights.append({
                'type': 'positive_connection',
                'message': f'Strong emotional connection: {joy_pct + love_pct:.0f}% express joy or love',
                'action': 'Leverage this emotional bond in fan engagement campaigns'
            })
        
        # High anger/sadness = potential issues
        anger_pct = float(emotion_summary['anger']['percentage'].rstrip('%'))
        sadness_pct = float(emotion_summary['sadness']['percentage'].rstrip('%'))
        
        if anger_pct + sadness_pct > 30:
            insights.append({
                'type': 'concern',
                'message': f'{anger_pct + sadness_pct:.0f}% express negative emotions',
                'action': 'Investigate concerns, engage in community dialogue'
            })
        
        # Surprise = virality potential
        surprise_pct = float(emotion_summary['surprise']['percentage'].rstrip('%'))
        if surprise_pct > 20:
            insights.append({
                'type': 'viral_potential',
                'message': f'{surprise_pct:.0f}% express surprise - indicates unexpected impact',
                'action': 'Content is generating buzz - amplify reach now'
            })
        
        # VADER vs Emotion comparison
        vader_pos = float(vader_summary['positive']['percentage'].rstrip('%'))
        if abs(vader_pos - (joy_pct + love_pct)) > 15:
            insights.append({
                'type': 'nuanced_sentiment',
                'message': 'Emotion analysis reveals nuances beyond basic sentiment',
                'action': 'Use detailed emotions for targeted content strategy'
            })
        
        return insights
    
    def compare_with_vader(self, comments_df):
        """
        Direct comparison: VADER vs Emotion Model
        For thesis methodology section
        """
        if not self.model_loaded:
            return {'error': 'Emotion model not loaded'}
        
        results = self.analyze_emotions(comments_df)
        
        if 'error' in results:
            return results
        
        # Create comparison table
        comparison = {
            'methodology_comparison': {
                'vader': {
                    'approach': '3-way classification (positive/neutral/negative)',
                    'technique': 'Lexicon-based with intensity rules',
                    'results': results['vader_sentiment']
                },
                'emotion_model': {
                    'approach': '6-way emotion detection',
                    'technique': 'Transformer-based deep learning (DistilRoBERTa)',
                    'results': results['emotion_distribution']
                }
            },
            'key_differences': [
                'VADER is faster but less nuanced',
                'Emotion model captures subtle feelings (love, surprise, fear)',
                'Emotion model better for female artist audience (emotional connection)',
                'Combined approach provides comprehensive sentiment picture'
            ]
        }
        
        return comparison