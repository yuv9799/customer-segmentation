# Customer Segmentation using K-Means Clustering

An advanced web application for customer segmentation using K-Means clustering algorithm. Built with FastAPI backend and React/TypeScript frontend.

## Features

- **Single Customer Prediction**: Get instant segment predictions for individual customers
- **Batch Segmentation**: Analyze multiple customers at once with comprehensive cluster analysis
- **Interactive Visualizations**: Explore elbow method charts and cluster distributions
- **Real-time Analysis**: Fast API responses with detailed segment descriptions
- **Responsive Design**: Beautiful UI/UX with animations and glassmorphism effects

## Tech Stack

### Backend
- FastAPI - Modern Python web framework
- scikit-learn - K-Means clustering implementation
- pandas - Data manipulation
- numpy - Numerical computations
- joblib - Model serialization

### Frontend
- React 18 - UI library
- TypeScript - Type safety
- Vite - Build tool
- Tailwind CSS - Styling
- React Router - Navigation
- Hero Icons - Icon library

### Deployment
- Docker & Docker Compose
- Nginx - Frontend server

## Dataset

The application uses the Mall Customers dataset containing:
- Customer ID
- Gender
- Age
- Annual Income (k$)
- Spending Score (1-100)

## Installation

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yuvraj/customer-segmentation.git
cd customer-segmentation
```

2. Start the application:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Local Development

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `POST /api/segment` - Single customer segmentation
- `POST /api/batch-segment` - Batch customer segmentation
- `GET /api/data/summary` - Dataset summary statistics
- `GET /api/data/raw` - Raw customer data
- `GET /api/elbow-data` - Elbow method data for visualization

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   └── routes/          # API routes
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── main.tsx
│   ├── package.json
│   └── Dockerfile
├── data/
│   └── Mall_Customers.csv   # Dataset
├── docker-compose.yml
└── README.md
```

## How It Works

1. **Data Loading**: The application loads customer data from the CSV file
2. **Preprocessing**: Features are normalized using StandardScaler
3. **Optimal Cluster Detection**: Uses elbow method to determine optimal K value
4. **K-Means Training**: Trains K-Means model on the dataset
5. **Prediction**: Segments new customers based on age, income, and spending score
6. **Visualization**: Displays results with interactive charts

## Segment Descriptions

The system automatically generates descriptions like:
- "Young customer with low income who is a high spender"
- "Middle-aged customer with high income who is a moderate spender"
- "Senior customer with medium income who is a low spender"

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

## Author

Built with ❤️ using FastAPI and React