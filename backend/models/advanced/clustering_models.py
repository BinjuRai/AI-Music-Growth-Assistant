"""
Advanced Clustering Comparison
Compares K-Means with alternative algorithms
"""
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
import numpy as np

class ClusteringComparison:
    """
    Compare multiple clustering algorithms
    Keeps your K-Means as primary, adds alternatives for thesis comparison
    """
    
    def __init__(self, n_clusters=3):
        self.n_clusters = n_clusters
        self.scaler = StandardScaler()
        self.models = {}
        self.results = {}
    
    def fit_all_models(self, features_df):
        """
        Run all clustering algorithms and compare
        
        Args:
            features_df: DataFrame with 'engagement_score' and 'loyalty_score'
        
        Returns:
            dict: Comparison results for all models
        """
        # Prepare features (same as your current approach)
        feature_cols = ['engagement_score', 'loyalty_score']
        X = features_df[feature_cols].values
        
        # Standardize
        X_scaled = self.scaler.fit_transform(X)
        
        # 1. K-Means (Your current primary algorithm)
        print("🔄 Running K-Means...")
        self._fit_kmeans(X_scaled)
        
        # 2. Gaussian Mixture Model (Better for overlapping segments)
        print("🔄 Running Gaussian Mixture...")
        self._fit_gmm(X_scaled)
        
        # 3. Hierarchical Clustering (Shows listener hierarchy)
        print("🔄 Running Hierarchical...")
        self._fit_hierarchical(X_scaled)
        
        # 4. DBSCAN (Finds outlier/unique listeners)
        print("🔄 Running DBSCAN...")
        self._fit_dbscan(X_scaled)
        
        # Compare all models
        self._compare_metrics(X_scaled)
        
        return self.results
    
    def _fit_kmeans(self, X):
        """K-Means (your existing algorithm)"""
        model = KMeans(
            n_clusters=self.n_clusters,
            init='k-means++',
            n_init=10,
            max_iter=300,
            random_state=42
        )
        labels = model.fit_predict(X)
        
        self.models['kmeans'] = model
        self.results['kmeans'] = {
            'name': 'K-Means (Current)',
            'labels': labels.tolist(),
            'centers': model.cluster_centers_.tolist(),
            'inertia': float(model.inertia_)
        }
    
    def _fit_gmm(self, X):
        """Gaussian Mixture Model - Soft clustering with probabilities"""
        model = GaussianMixture(
            n_components=self.n_clusters,
            covariance_type='full',
            random_state=42
        )
        model.fit(X)
        labels = model.predict(X)
        probabilities = model.predict_proba(X)
        
        self.models['gmm'] = model
        self.results['gmm'] = {
            'name': 'Gaussian Mixture Model',
            'labels': labels.tolist(),
            'probabilities': probabilities.tolist(),  # Soft clustering!
            'bic': float(model.bic(X)),  # Model selection criterion
            'aic': float(model.aic(X))
        }
    
    def _fit_hierarchical(self, X):
        """Hierarchical Clustering - Shows listener relationships"""
        model = AgglomerativeClustering(
            n_clusters=self.n_clusters,
            linkage='ward'  # Minimizes variance
        )
        labels = model.fit_predict(X)
        
        self.models['hierarchical'] = model
        self.results['hierarchical'] = {
            'name': 'Hierarchical Clustering',
            'labels': labels.tolist(),
            'n_leaves': model.n_leaves_,
            'n_connected_components': model.n_connected_components_
        }
    
    def _fit_dbscan(self, X):
        """DBSCAN - Density-based, finds outliers"""
        model = DBSCAN(
            eps=0.5,  # Adjust based on your data density
            min_samples=5
        )
        labels = model.fit_predict(X)
        
        # DBSCAN can find variable number of clusters
        n_clusters_found = len(set(labels)) - (1 if -1 in labels else 0)
        n_noise = list(labels).count(-1)
        
        self.models['dbscan'] = model
        self.results['dbscan'] = {
            'name': 'DBSCAN (Density-Based)',
            'labels': labels.tolist(),
            'n_clusters_found': n_clusters_found,
            'n_noise_points': n_noise,
            'core_samples': model.core_sample_indices_.tolist() if hasattr(model, 'core_sample_indices_') else []
        }
    
    def _compare_metrics(self, X):
        """Calculate comparison metrics for all models"""
        print("\n📊 Calculating comparison metrics...")
        
        for model_name, result in self.results.items():
            labels = np.array(result['labels'])
            
            # Skip metrics for DBSCAN if only one cluster or all noise
            n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
            if n_clusters < 2:
                result['metrics'] = {
                    'silhouette_score': None,
                    'davies_bouldin_score': None,
                    'calinski_harabasz_score': None,
                    'note': 'Insufficient clusters for metric calculation'
                }
                continue
            
            try:
                # Silhouette Score (higher is better, range -1 to 1)
                silhouette = silhouette_score(X, labels)
                
                # Davies-Bouldin Score (lower is better)
                davies_bouldin = davies_bouldin_score(X, labels)
                
                # Calinski-Harabasz Score (higher is better)
                calinski = calinski_harabasz_score(X, labels)
                
                result['metrics'] = {
                    'silhouette_score': float(silhouette),
                    'davies_bouldin_score': float(davies_bouldin),
                    'calinski_harabasz_score': float(calinski)
                }
                
            except Exception as e:
                result['metrics'] = {
                    'error': str(e)
                }
    
    def get_best_model(self):
        """
        Determine best model based on silhouette score
        (You can keep K-Means as primary regardless)
        """
        best_model = None
        best_score = -1
        
        for model_name, result in self.results.items():
            if 'metrics' in result and result['metrics'].get('silhouette_score'):
                score = result['metrics']['silhouette_score']
                if score > best_score:
                    best_score = score
                    best_model = model_name
        
        return {
            'best_model': best_model,
            'best_silhouette_score': best_score,
            'recommendation': f"K-Means performs well (silhouette={self.results['kmeans']['metrics']['silhouette_score']:.3f}), "
                            f"but {best_model} achieved highest score ({best_score:.3f})"
        }
    
    def generate_comparison_table(self):
        """
        Generate markdown table for thesis
        """
        table = "| Algorithm | Silhouette ↑ | Davies-Bouldin ↓ | Calinski-Harabasz ↑ | Notes |\n"
        table += "|-----------|--------------|-------------------|---------------------|-------|\n"
        
        for model_name, result in self.results.items():
            metrics = result.get('metrics', {})
            sil = metrics.get('silhouette_score', 'N/A')
            db = metrics.get('davies_bouldin_score', 'N/A')
            ch = metrics.get('calinski_harabasz_score', 'N/A')
            
            # Format numbers
            sil_str = f"{sil:.3f}" if isinstance(sil, (int, float)) else sil
            db_str = f"{db:.3f}" if isinstance(db, (int, float)) else db
            ch_str = f"{ch:.1f}" if isinstance(ch, (int, float)) else ch
            
            note = "Primary algorithm" if model_name == 'kmeans' else ""
            if model_name == 'gmm':
                note = "Soft clustering"
            elif model_name == 'dbscan':
                note = f"Found {result['n_clusters_found']} clusters"
            
            table += f"| {result['name']} | {sil_str} | {db_str} | {ch_str} | {note} |\n"
        
        return table