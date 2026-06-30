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

export const segmentCustomer = async (data: CustomerData): Promise<ClusteringResponse> => {
  const response = await api.post<ClusteringResponse>('/segment', data)
  return response.data
}

export const batchSegment = async (data: CustomerData[], n_clusters?: number): Promise<BatchSegmentResponse> => {
  const response = await api.post<BatchSegmentResponse>('/batch-segment', { data, n_clusters })
  return response.data
}

export const getDataSummary = async () => {
  const response = await api.get('/data/summary')
  return response.data
}

export const getElbowData = async (max_k?: number) => {
  const response = await api.get('/elbow-data', { params: { max_k } })
  return response.data
}