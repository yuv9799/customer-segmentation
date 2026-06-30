import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDataSummary } from '../services/api'
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline'

interface DataSummary {
  total_customers: number
  avg_age: number
  avg_income: number
  avg_spending: number
  gender_distribution: Record<string, number>
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DataSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDataSummary()
        setSummary(data)
      } catch (error) {
        console.error('Error fetching summary:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
          Customer Segmentation
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Unlock powerful insights with AI-powered K-Means clustering. 
          Understand your customers better and drive business growth.
        </p>
      </div>

      {/* Stats Grid */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{summary.total_customers}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Age</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{summary.avg_age.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-accent-600" />
              </div>
            </div>
          </div>

          <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Income (k$)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{summary.avg_income.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Spending Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{summary.avg_spending.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Link to="/predict" className="card group hover:scale-105 transform transition-all duration-300">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Single Prediction</h3>
            <p className="text-gray-600">
              Get instant segment prediction for individual customers based on age, income, and spending score.
            </p>
          </div>
        </Link>

        <Link to="/batch" className="card group hover:scale-105 transform transition-all duration-300">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Batch Segmentation</h3>
            <p className="text-gray-600">
              Upload or input multiple customers and get comprehensive cluster analysis with summaries.
            </p>
          </div>
        </Link>

        <Link to="/visualization" className="card group hover:scale-105 transform transition-all duration-300">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Visualizations</h3>
            <p className="text-gray-600">
              Explore interactive charts, elbow method graphs, and cluster visualizations.
            </p>
          </div>
        </Link>
      </div>

      {/* Info Section */}
      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mb-3">1</div>
            <h3 className="font-semibold text-gray-900 mb-2">Data Collection</h3>
            <p className="text-gray-600 text-sm">Gather customer data including age, annual income, and spending score.</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mb-3">2</div>
            <h3 className="font-semibold text-gray-900 mb-2">K-Means Clustering</h3>
            <p className="text-gray-600 text-sm">Apply K-Means algorithm to group customers into distinct segments.</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mb-3">3</div>
            <h3 className="font-semibold text-gray-900 mb-2">Actionable Insights</h3>
            <p className="text-gray-600 text-sm">Use cluster information to tailor marketing strategies and improve customer experience.</p>
          </div>
        </div>
      </div>
    </div>
  )
}