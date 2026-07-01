import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-railway-backend.up.railway.app'

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface CustomerData {
  age: number
  annual_income: number
  spending_score: number
}

export interface ClusteringResponse {
  cluster: number
  cluster_centers: number[][]
  inertia: number
  segment_description: string
}

export interface BatchSegmentResponse {
  results: Array<{
    customer_id: number
    age: number
    annual_income: number
    spending_score: number
    cluster: number
  }>
  cluster_summary: Record<string, {
    count: number
    avg_age: number
    avg_income: number
    avg_spending: number
    description: string
  }>
  optimal_clusters: number
}

// Fallback Mock Data & Logic
const MOCK_CENTROIDS = [
  { id: 0, age: 41.1, income: 88.2, spending: 17.1, desc: "Middle-aged customer with high income who is a Low spender" },
  { id: 1, age: 32.6, income: 86.5, spending: 82.1, desc: "Young/Middle-aged customer with high income who is a High spender" },
  { id: 2, age: 42.7, income: 55.3, spending: 49.5, desc: "Middle-aged customer with medium income who is a Moderate spender" },
  { id: 3, age: 25.3, income: 25.7, spending: 79.9, desc: "Young customer with low income who is a High spender" },
  { id: 4, age: 45.2, income: 26.3, spending: 20.9, desc: "Middle-aged/Senior customer with low income who is a Low spender" }
]

const computeEuclideanCluster = (customer: CustomerData): number => {
  let minDistance = Infinity
  let assignedCluster = 0
  
  MOCK_CENTROIDS.forEach(centroid => {
    const dAge = (customer.age - centroid.age) / 50
    const dIncome = (customer.annual_income - centroid.income) / 100
    const dSpending = (customer.spending_score - centroid.spending) / 100
    const dist = Math.sqrt(dAge*dAge + dIncome*dIncome + dSpending*dSpending)
    if (dist < minDistance) {
      minDistance = dist
      assignedCluster = centroid.id
    }
  })
  
  return assignedCluster
}

export const segmentCustomer = async (data: CustomerData): Promise<ClusteringResponse> => {
  try {
    const response = await api.post<ClusteringResponse>('/segment', data)
    return response.data
  } catch (error) {
    console.warn('Backend API offline. Falling back to client-side prediction.', error)
    const cluster = computeEuclideanCluster(data)
    return {
      cluster,
      cluster_centers: MOCK_CENTROIDS.map(c => [c.age, c.income, c.spending]),
      inertia: 65.4,
      segment_description: MOCK_CENTROIDS[cluster].desc
    }
  }
}

export const batchSegment = async (data: CustomerData[], n_clusters?: number): Promise<BatchSegmentResponse> => {
  try {
    const response = await api.post<BatchSegmentResponse>('/batch-segment', { data, n_clusters })
    return response.data
  } catch (error) {
    console.warn('Backend API offline. Falling back to client-side batch prediction.', error)
    const results = data.map((d, i) => ({
      customer_id: i + 1,
      age: d.age,
      annual_income: d.annual_income,
      spending_score: d.spending_score,
      cluster: computeEuclideanCluster(d)
    }))

    const optimal_clusters = n_clusters || 5
    const cluster_summary: Record<string, any> = {}

    for (let c = 0; c < optimal_clusters; c++) {
      const clusterCustomers = results.filter(r => r.cluster === c)
      if (clusterCustomers.length > 0) {
        const sumAge = clusterCustomers.reduce((acc, curr) => acc + curr.age, 0)
        const sumIncome = clusterCustomers.reduce((acc, curr) => acc + curr.annual_income, 0)
        const sumSpending = clusterCustomers.reduce((acc, curr) => acc + curr.spending_score, 0)
        const count = clusterCustomers.length
        
        cluster_summary[c.toString()] = {
          count,
          avg_age: sumAge / count,
          avg_income: sumIncome / count,
          avg_spending: sumSpending / count,
          description: MOCK_CENTROIDS[c]?.desc || "Customer segment patterns"
        }
      }
    }

    return {
      results,
      cluster_summary,
      optimal_clusters
    }
  }
}

export const getDataSummary = async () => {
  try {
    const response = await api.get('/data/summary')
    return response.data
  } catch (error) {
    console.warn('Backend API offline. Falling back to client-side summary data.', error)
    return {
      total_customers: 200,
      avg_age: 38.85,
      avg_income: 60.56,
      avg_spending: 50.2,
      gender_distribution: {
        Female: 112,
        Male: 88
      }
    }
  }
}

export const getElbowData = async (max_k?: number) => {
  try {
    const response = await api.get('/elbow-data', { params: { max_k } })
    return response.data
  } catch (error) {
    console.warn('Backend API offline. Falling back to client-side elbow data.', error)
    return {
      k_values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      wcss: [269.9, 181.3, 117.8, 83.5, 65.4, 53.2, 44.1, 37.2, 32.5, 29.1]
    }
  }
}