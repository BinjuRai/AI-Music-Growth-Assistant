## AI Music Growth Assistant for Emerging Female Artists (Kathmandu Valley, Nepal)

An AI-powered analytics platform that analyzes listener behavior and audience sentiment for multiple emerging female artists in the Kathmandu Valley, providing **data-driven growth recommendations** via a modern React dashboard.

### Features

- **Multi-artist support:** 50–100+ artists stored in MongoDB.
- **Listener segmentation:** K-Means clustering with proper feature engineering.
- **Sentiment analysis:** VADER-based analysis of audience comments.
- **Time-series engagement data:** 30-day platform metrics.
- **Interactive dashboard:** React + Tailwind CSS + Recharts visualizations.
- **Actionable recommendations:** Automatically generated strategy tips.

---

## Architecture

CSV Data → Synthetic Data Generator → MongoDB Import → Flask API → ML Models → React Dashboard

- **Backend:** Flask, PyMongo, Pandas, NumPy, Scikit-learn, VADER.
- **Frontend:** React (Vite), Axios, Recharts, Tailwind CSS.
- **Database:** MongoDB (`music_growth_assistant`).

---

## 1. Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB running locally on `mongodb://localhost:27017/`

### Backend Setup

```bash
cd "/Users/binju/Desktop/individual project Thesis"
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r backend/requirements.txt
```

### Frontend Setup

```bash
cd "/Users/binju/Desktop/individual project Thesis/frontend"
npm install
```

---

## 2. Data Generation and Import

### Step 1: Generate Synthetic CSV Data

From the project root:

```bash
cd "/Users/binju/Desktop/individual project Thesis"
python generate_synthetic_data.py
```

This creates:

- `artists.csv`
- `listeners.csv`
- `comments.csv`
- `engagement_metrics.csv`

### Step 2: Import into MongoDB

```bash
python import_to_mongodb.py
```

This will:

- Connect to `mongodb://localhost:27017/`
- Create/use database `music_growth_assistant`
- Insert data into collections:
  - `artists`
  - `listeners`
  - `comments`
  - `engagement_metrics`

---

## 3. Running the Backend (Flask API)

From the project root with the virtual environment activated:

```bash
cd "/Users/binju/Desktop/individual project Thesis"
python -m backend.app
```

The API will run at `http://localhost:5000`.

### Key Endpoints

- **GET** `/api/health`  
  Returns basic health check status.

- **GET** `/api/artists`  
  Returns list of artists for the dropdown:

  ```json
  [
    {
      "_id": "603c...",
      "artist_name": "Shreya Karki",
      "genre": "Pop",
      "location": "Kathmandu"
    }
  ]
  ```

- **GET** `/api/artists/<artist_id>`  
  Returns detailed info for one artist:

  ```json
  {
    "_id": "603c...",
    "artist_name": "Shreya Karki",
    "genre": "Pop",
    "location": "Kathmandu",
    "total_followers": 5000,
    "platforms": ["spotify", "youtube", "instagram"]
  }
  ```

- **POST** `/api/analyze/<artist_id>`  
  Runs the full ML pipeline for the selected artist and returns:

  - Listener segmentation and percentages
  - Cluster statistics
  - Sentiment distribution
  - Silhouette score (model quality)
  - Personalized recommendations
  - Key insights

---

## 4. Running the Frontend (React Dashboard)

From the `frontend` directory:

```bash
cd "/Users/binju/Desktop/individual project Thesis/frontend"
npm run dev
```

Open the suggested `localhost:5173` URL in your browser.

Ensure the Flask backend is running on `http://localhost:5000` before using the dashboard.

---

## 5. Frontend Overview

- **Header:**  
  Title “AI Music Growth Assistant for Emerging Female Artists” and subtitle “Kathmandu Valley, Nepal”.

- **Artist Selection:**  
  Dropdown populated from `/api/artists` showing `"Artist Name (Genre)"` and an **Analyze Artist** button with loading state.

- **Results Dashboard (after analysis):**

  - **Listener Segments Distribution:**  
    Pie chart with 3 segments using Recharts:
    - Superfans (green `#10b981`)
    - Casual Listeners (blue `#3b82f6`)
    - One-time Listeners (red `#ef4444`)

  - **Audience Sentiment:**  
    Bar chart (positive, neutral, negative) in purple `#8b5cf6`.

  - **Segment Performance Metrics:**  
    Tailwind-styled table:
    - Segment (cluster)
    - Avg Streams
    - Avg Engagement
    - Avg Loyalty
    - Count  
    Best-performing cluster highlighted.

  - **📊 Personalized Recommendations:**  
    Color-coded cards by priority:
    - High: blue emphasis
    - Medium: yellow

  - **💡 Key Insights:**  
    Bullet list of insights and silhouette score:
    - “Average streams per listener”
    - “Top 10 listeners contribute … streams”
    - “Average completion rate …”

---

## 6. ML & Analytics Details

- **Feature Engineering:**
  - `engagement_score` combines streams, saves, shares, and completion rate.
  - `loyalty_score` combines session counts, durations, and inverse skip rate.

- **Clustering:**
  - K-Means with:
    - `n_clusters=3`
    - `init="k-means++"`
    - `n_init=10`
    - `max_iter=300`
  - Features standardized with `StandardScaler`.
  - Cluster quality measured via **silhouette_score**.
  - Semantic labels assigned: Superfans, Casual Listeners, One-time Listeners.

- **Sentiment Analysis:**
  - Uses `vaderSentiment`’s `SentimentIntensityAnalyzer`.
  - `compound` scores mapped to positive, neutral, negative buckets.

- **Recommendation Logic:**
  - Uses segment sizes and sentiment ratios to propose:
    - Engagement strategies (superfans)
    - Conversion from casual to superfans
    - Retention focus for one-time listeners
    - Sentiment-driven timing for releases or engagement.

---

## 7. Ethical / Thesis Notes

- **Focus:** Emerging female artists in Kathmandu Valley, supporting sustainable and ethical career growth.
- **Privacy:** Data here is synthetic; in a real deployment:
  - Use anonymized listener IDs.
  - Avoid storing unnecessary personal data.
  - Provide transparency to artists about how models work.
- **Autonomy:** Recommendations are advisory, not prescriptive; artists remain in control of their creative decisions.

---

## 8. Project Structure

- `generate_synthetic_data.py` – Generate CSVs for artists, listeners, comments, engagement.
- `import_to_mongodb.py` – Import CSVs into MongoDB with proper `artist_id` references.
- `backend/`
  - `app.py` – Flask app, routes registration, CORS.
  - `config.py` – MongoDB and Flask configuration.
  - `models/`
    - `database.py` – MongoDB connection.
    - `ml_models.py` – Feature engineering, clustering, sentiment, recommendations.
  - `routes/`
    - `artists.py` – `/api/artists` endpoints.
    - `analytics.py` – `/api/analyze/<artist_id>` analysis endpoint.
  - `requirements.txt` – Python dependencies.
- `frontend/`
  - `src/App.jsx` – Main React component / dashboard.
  - `src/components/*` – UI widgets (charts, selector, recommendations, insights).
  - `src/api/axios.js` – Axios instance.
  - `src/index.css` – Tailwind CSS imports.
  - `tailwind.config.js`, `vite.config.js`, `package.json` – Frontend tooling.

This structure and implementation are designed to be **academic-quality** while remaining practical and extensible for your thesis. You can now run end-to-end experiments, capture screenshots, and discuss ML, UX, and ethical considerations in your report.

