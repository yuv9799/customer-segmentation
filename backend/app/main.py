import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib
import json
from typing import List, Optional, Dict, Any

app = FastAPI(title="Customer Segmentation API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yuv9799.github.io", "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class CustomerData(BaseModel):
    age: int
    annual_income: int
    spending_score: int

class ClusteringResponse(BaseModel):
    cluster: int
    cluster_centers: List[List[float]]
    inertia: float
    segment_description: str

class BatchSegmentRequest(BaseModel):
    data: List[CustomerData]
    n_clusters: int = 5

class BatchSegmentResponse(BaseModel):
    results: List[Dict[str, Any]]
    cluster_summary: Dict[str, Any]
    optimal_clusters: int

# Global variables
model_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "kmeans_model.pkl")
scaler_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "scaler.pkl")
data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "Mall_Customers.csv")

# Load data and initialize
df = pd.read_csv(data_path)
X = df[['Age', 'Annual Income (k$)', 'Spending Score (1-100)']].values
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

def get_optimal_clusters(X, max_k=10):
    wcss = []
    for i in range(1, max_k + 1):
        kmeans = KMeans(n_clusters=i, random_state=42, n_init=10)
        kmeans.fit(X)
        wcss.append(kmeans.inertia_)
    
    # Find elbow point using second derivative
    deltas = np.diff(wcss)
    deltas2 = np.diff(deltas)
    optimal_k = np.argmax(deltas2) + 2
    return min(optimal_k, max_k), wcss

def get_segment_description(cluster_id, centers):
    age = centers[cluster_id][0]
    income = centers[cluster_id][1]
    spending = centers[cluster_id][2]
    
    age_desc = "young" if age < 30 else "middle-aged" if age < 50 else "senior"
    income_desc = "low income" if income < 50 else "medium income" if income < 80 else "high income"
    spending_desc = "low spender" if spending < 40 else "moderate spender" if spending < 70 else "high spender"
    
    return f"{age_desc.capitalize()} customer with {income_desc} who is a {spending_desc.capitalize()}"

@app.get("/")
async def root():
    return {"message": "Customer Segmentation API is running"}

@app.post("/api/segment", response_model=ClusteringResponse)
async def segment_customer(customer: CustomerData):
    # Try to load existing model
    if os.path.exists(model_path):
        kmeans = joblib.load(model_path)
    else:
        optimal_k, _ = get_optimal_clusters(X_scaled)
        kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
        kmeans.fit(X_scaled)
        joblib.dump(kmeans, model_path)
    
    # Scale input and predict
    input_data = np.array([[customer.age, customer.annual_income, customer.spending_score]])
    input_scaled = scaler.transform(input_data)
    cluster = int(kmeans.predict(input_scaled)[0])
    
    # Denormalize cluster centers
    centers_original = scaler.inverse_transform(kmeans.cluster_centers_)
    
    description = get_segment_description(cluster, centers_original)
    
    return {
        "cluster": cluster,
        "cluster_centers": centers_original.tolist(),
        "inertia": float(kmeans.inertia_),
        "segment_description": description
    }

@app.post("/api/batch-segment", response_model=BatchSegmentResponse)
async def batch_segment(request: BatchSegmentRequest):
    # Train clustering model
    optimal_k, wcss = get_optimal_clusters(X_scaled, max_k=min(10, len(request.data)))
    kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
    
    # Combine original data with new data
    new_data = np.array([[d.age, d.annual_income, d.spending_score] for d in request.data])
    combined_data = np.vstack([X, new_data])
    combined_scaled = scaler.fit_transform(combined_data)
    
    kmeans.fit(combined_scaled)
    
    # Predict for new data
    new_scaled = scaler.transform(new_data)
    new_clusters = kmeans.predict(new_scaled)
    
    # Get cluster centers in original scale
    centers_original = scaler.inverse_transform(kmeans.cluster_centers_)
    
    # Build results
    results = []
    for i, d in enumerate(request.data):
        results.append({
            "customer_id": i + 1,
            "age": d.age,
            "annual_income": d.annual_income,
            "spending_score": d.spending_score,
            "cluster": int(new_clusters[i])
        })
    
    # Cluster summary
    cluster_summary = {}
    for cluster_id in range(optimal_k):
        mask = new_clusters == cluster_id
        count = int(np.sum(mask))
        if count > 0:
            cluster_summary[str(cluster_id)] = {
                "count": count,
                "avg_age": float(np.mean([d.age for i, d in enumerate(request.data) if new_clusters[i] == cluster_id])),
                "avg_income": float(np.mean([d.annual_income for i, d in enumerate(request.data) if new_clusters[i] == cluster_id])),
                "avg_spending": float(np.mean([d.spending_score for i, d in enumerate(request.data) if new_clusters[i] == cluster_id])),
                "description": get_segment_description(cluster_id, centers_original)
            }
    
    # Save model
    joblib.dump(kmeans, model_path)
    joblib.dump(scaler, scaler_path)
    
    return {
        "results": results,
        "cluster_summary": cluster_summary,
        "optimal_clusters": optimal_k
    }

@app.get("/api/data/summary")
async def get_data_summary():
    return {
        "total_customers": int(len(df)),
        "avg_age": float(df['Age'].mean()),
        "avg_income": float(df['Annual Income (k$)'].mean()),
        "avg_spending": float(df['Spending Score (1-100)'].mean()),
        "gender_distribution": df['Gender'].value_counts().to_dict()
    }

@app.get("/api/data/raw")
async def get_raw_data(limit: int = 100):
    return df.head(limit).to_dict(orient='records')

@app.get("/api/elbow-data")
async def get_elbow_data(max_k: int = 10):
    _, wcss = get_optimal_clusters(X_scaled, max_k=max_k)
    return {
        "k_values": list(range(1, max_k + 1)),
        "wcss": [float(x) for x in wcss]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)