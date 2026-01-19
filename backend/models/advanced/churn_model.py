"""
Churn Prediction Model
Predicts which listeners are at risk of stopping engagement
"""
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
import numpy as np
import pandas as pd

class ChurnPredictor:
    """
    Predict listener churn risk using Random Forest
    """
    
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            class_weight='balanced'  # Handle imbalanced data
        )
        self.feature_importance = {}
        self.is_trained = False
    
    def prepare_churn_labels(self, churn_data):
        """
        Define churn based on listener behavior
        
        Churn definition:
        - No activity in last 30 days AND
        - Declining engagement trend
        """
        churn_data['is_churned'] = (
            (churn_data['days_since_last_stream'] > 30) & 
            (churn_data['declining_trend'] < -0.2)
        ).astype(int)
        
        return churn_data
    
    def train(self, churn_data):
        """
        Train churn prediction model
        
        Args:
            churn_data: DataFrame with features from DataFetcher.prepare_churn_features()
        
        Returns:
            dict: Training results and metrics
        """
        if churn_data.empty:
            return {'error': 'No data available for training'}
        
        # Prepare labels
        churn_data = self.prepare_churn_labels(churn_data)
        
        # Select features
        feature_cols = [
            'engagement_score',
            'loyalty_score',
            'days_since_last_stream',
            'stream_sessions',
            'avg_skip_rate',
            'declining_trend'
        ]
        
        # Ensure all features exist
        available_features = [col for col in feature_cols if col in churn_data.columns]
        
        X = churn_data[available_features].fillna(0)
        y = churn_data['is_churned']
        
        # Check if we have enough churned samples
        n_churned = y.sum()
        n_total = len(y)
        
        if n_churned < 5:
            # Not enough churned listeners for training
            return {
                'error': 'Insufficient churn data',
                'message': f'Only {n_churned} churned listeners found. Need at least 5 for training.',
                'churn_rate': f'{(n_churned/n_total)*100:.1f}%'
            }
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train model
        print(f"🎯 Training churn model with {len(X_train)} samples...")
        self.model.fit(X_train, y_train)
        self.is_trained = True
        
        # Evaluate
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        
        # Cross-validation
        cv_scores = cross_val_score(self.model, X, y, cv=5)
        
        # Predictions
        y_pred = self.model.predict(X_test)
        y_pred_proba = self.model.predict_proba(X_test)[:, 1]
        
        # Feature importance
        self.feature_importance = dict(zip(
            available_features,
            self.model.feature_importances_
        ))
        
        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred)
        
        return {
            'training_complete': True,
            'metrics': {
                'train_accuracy': float(train_score),
                'test_accuracy': float(test_score),
                'cv_mean_accuracy': float(cv_scores.mean()),
                'cv_std_accuracy': float(cv_scores.std()),
                'roc_auc_score': float(roc_auc_score(y_test, y_pred_proba))
            },
            'confusion_matrix': {
                'true_negatives': int(cm[0, 0]),
                'false_positives': int(cm[0, 1]),
                'false_negatives': int(cm[1, 0]),
                'true_positives': int(cm[1, 1])
            },
            'feature_importance': {
                k: float(v) for k, v in sorted(
                    self.feature_importance.items(),
                    key=lambda x: x[1],
                    reverse=True
                )
            },
            'dataset_info': {
                'total_listeners': n_total,
                'churned_listeners': int(n_churned),
                'churn_rate': f'{(n_churned/n_total)*100:.1f}%'
            }
        }
    
    def predict_churn_risk(self, churn_data):
        """
        Predict churn risk for current listeners
        
        Returns:
            dict: Listeners segmented by risk level
        """
        if not self.is_trained:
            return {'error': 'Model not trained yet. Call train() first.'}
        
        if churn_data.empty:
            return {'error': 'No listener data provided'}
        
        feature_cols = [
            'engagement_score',
            'loyalty_score',
            'days_since_last_stream',
            'stream_sessions',
            'avg_skip_rate',
            'declining_trend'
        ]
        
        available_features = [col for col in feature_cols if col in churn_data.columns]
        X = churn_data[available_features].fillna(0)
        
        # Predict probabilities
        churn_probabilities = self.model.predict_proba(X)[:, 1]
        
        # Add to dataframe
        churn_data['churn_risk_score'] = churn_probabilities
        
        # Segment by risk
        high_risk = churn_data[churn_probabilities > 0.7]
        medium_risk = churn_data[(churn_probabilities > 0.4) & (churn_probabilities <= 0.7)]
        low_risk = churn_data[churn_probabilities <= 0.4]
        
        return {
            'predictions_complete': True,
            'risk_segments': {
                'high_risk': {
                    'count': len(high_risk),
                    'percentage': f'{(len(high_risk)/len(churn_data))*100:.1f}%',
                    'listeners': high_risk[['listener_id', 'churn_risk_score', 'days_since_last_stream']].to_dict('records')[:10]  # Top 10
                },
                'medium_risk': {
                    'count': len(medium_risk),
                    'percentage': f'{(len(medium_risk)/len(churn_data))*100:.1f}%'
                },
                'low_risk': {
                    'count': len(low_risk),
                    'percentage': f'{(len(low_risk)/len(churn_data))*100:.1f}%'
                }
            },
            'recommendations': self._generate_retention_strategies(high_risk, medium_risk)
        }
    
    def _generate_retention_strategies(self, high_risk, medium_risk):
        """Generate actionable retention recommendations"""
        strategies = []
        
        if len(high_risk) > 0:
            strategies.append({
                'priority': 'urgent',
                'target': 'High-risk listeners',
                'action': f'Immediate re-engagement campaign for {len(high_risk)} listeners',
                'tactics': [
                    'Send personalized "We miss you" message',
                    'Offer exclusive preview of upcoming release',
                    'Create custom playlist based on their history'
                ]
            })
        
        if len(medium_risk) > 0:
            strategies.append({
                'priority': 'high',
                'target': 'Medium-risk listeners',
                'action': f'Preventive engagement for {len(medium_risk)} listeners',
                'tactics': [
                    'Invite to live sessions or Q&A',
                    'Share behind-the-scenes content',
                    'Request feedback on new music'
                ]
            })
        
        return strategies