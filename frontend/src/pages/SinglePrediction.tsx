import { useState } from 'react'
import { segmentCustomer } from '../services/api'
import { 
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline'

interface PredictionResult {
  cluster: number
  cluster_centers: number[][]
  inertia: number
  segment_description: string
}

export default function SinglePrediction() {
  const [formData, setFormData] = useState({
    age: '',
    annual_income: '',
    spending_score: ''
  })
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await segmentCustomer({
        age: parseInt(formData.age),
        annual_income: parseInt(formData.annual_income),
        spending_score: parseInt(formData.spending_score)
      })
      setResult(response)
    } catch (error) {
      console.error('Error predicting segment:', error)
    } finally {
      setLoading(false)
    }
  }

  const getClusterColor = (cluster: number) => {
    const colors = [
      'bg-blue-100 border-blue-500 text-blue-700',
      'bg-green-100 border-green-500 text-green-700',
      'bg-purple-100 border-purple-500 text-purple-700',
      'bg-yellow-100 border-yellow-500 text-yellow-700',
      'bg-pink-100 border-pink-500 text-pink-700',
      'bg-indigo-100 border-indigo-500 text-indigo-700',
      'bg-red-100 border-red-500 text-red-700',
      'bg-orange-100 border-orange-500 text-orange-700',
    ]
    return colors[cluster % colors.length]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold gradient-text mb-4">Single Customer Prediction</h1>
        <p className="text-lg text-gray-600">
          Enter customer details to get instant segment prediction and insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="card animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Age
              </label>
              <input
                type="number"
                min="18"
                max="100"
                required
                className="input-field"
                placeholder="Enter age (18-100)"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CurrencyDollarIcon className="w-4 h-4 inline mr-2" />
                Annual Income (k$)
              </label>
              <input
                type="number"
                min="15"
                max="150"
                required
                className="input-field"
                placeholder="Enter annual income in thousands"
                value={formData.annual_income}
                onChange={(e) => setFormData({ ...formData, annual_income: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ChartBarIcon className="w-4 h-4 inline mr-2" />
                Spending Score (1-100)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                required
                className="input-field"
                placeholder="Enter spending score"
                value={formData.spending_score}
                onChange={(e) => setFormData({ ...formData, spending_score: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Predict Segment'
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result && (
            <>
              <div className="card animate-slide-up border-2 border-primary-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Segment Result</h3>
                  <span className={`px-4 py-2 rounded-lg font-semibold border-2 ${getClusterColor(result.cluster)}`}>
                    Cluster {result.cluster}
                  </span>
                </div>
                
                <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <SparklesIcon className="w-6 h-6 text-primary-600 mt-1 mr-3" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900">Segment Description</p>
                      <p className="text-gray-700 mt-1">{result.segment_description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-gray-600">Age</p>
                    <p className="text-lg font-bold text-gray-900">{result.cluster_centers[result.cluster][0].toFixed(0)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-gray-600">Income (k$)</p>
                    <p className="text-lg font-bold text-gray-900">{result.cluster_centers[result.cluster][1].toFixed(0)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-gray-600">Spending</p>
                    <p className="text-lg font-bold text-gray-900">{result.cluster_centers[result.cluster][2].toFixed(0)}</p>
                  </div>
                </div>
              </div>

              <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Cluster Centers (All Segments)</h3>
                <div className="space-y-2">
                  {result.cluster_centers.map((center, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${idx === result.cluster ? getClusterColor(idx) : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Cluster {idx}</span>
                        <span className="text-sm">
                          Age: {center[0].toFixed(0)} | Income: {center[1].toFixed(0)}k$ | Spending: {center[2].toFixed(0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {!result && !loading && (
            <div className="card animate-slide-up text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500">Enter customer details and click predict to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}