import { useEffect, useState } from 'react'
import { getElbowData } from '../services/api'

export default function DataVisualization() {
  const [elbowData, setElbowData] = useState<{ k_values: number[], wcss: number[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchElbowData = async () => {
      try {
        const data = await getElbowData()
        setElbowData(data)
      } catch (error) {
        console.error('Error fetching elbow data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchElbowData()
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
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold gradient-text mb-4">Data Visualization</h1>
        <p className="text-lg text-gray-600">
          Explore clustering analysis charts and customer segment patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Elbow Method Chart */}
        <div className="card animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Elbow Method</h2>
          <p className="text-gray-600 text-sm mb-4">
            The elbow method helps determine the optimal number of clusters by plotting WCSS (Within-Cluster Sum of Squares).
          </p>
          {elbowData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <svg viewBox="0 0 600 400" className="w-full">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={`h-${i}`} x1="50" y1={350 - i * 70} x2="550" y2={350 - i * 70} stroke="#e5e7eb" strokeWidth="1" />
                ))}
                
                {/* Data line */}
                <polyline
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  points={elbowData.k_values.map((k, i) => {
                    const x = 50 + (i * 500 / (elbowData.k_values.length - 1))
                    const maxWcss = Math.max(...elbowData.wcss)
                    const minWcss = Math.min(...elbowData.wcss)
                    const y = 350 - ((elbowData.wcss[i] - minWcss) / (maxWcss - minWcss)) * 280
                    return `${x},${y}`
                  }).join(' ')}
                />

                {/* Data points */}
                {elbowData.k_values.map((k, i) => {
                  const x = 50 + (i * 500 / (elbowData.k_values.length - 1))
                  const maxWcss = Math.max(...elbowData.wcss)
                  const minWcss = Math.min(...elbowData.wcss)
                  const y = 350 - ((elbowData.wcss[i] - minWcss) / (maxWcss - minWcss)) * 280
                  return (
                    <circle key={k} cx={x} cy={y} r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
                  )
                })}

                {/* Labels */}
                {elbowData.k_values.map((k, i) => {
                  const x = 50 + (i * 500 / (elbowData.k_values.length - 1))
                  return (
                    <text key={k} x={x} y="380" textAnchor="middle" className="text-xs fill-gray-600">
                      {k}
                    </text>
                  )
                })}

                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>

                {/* Axis labels */}
                <text x="300" y="15" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                  Number of Clusters (K)
                </text>
                <text x="15" y="200" textAnchor="middle" transform="rotate(-90, 15, 200)" className="text-sm font-semibold fill-gray-700">
                  WCSS
                </text>
              </svg>
            </div>
          )}

          {/* Optimal K Display */}
          {elbowData && (
            <div className="mt-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4">
              <p className="text-center">
                <span className="text-sm text-gray-600">Optimal Number of Clusters:</span>
                <span className="text-2xl font-bold text-primary-600 ml-2">
                  {(() => {
                    const deltas = elbowData.wcss.slice(1).map((v, i) => elbowData.wcss[i] - v)
                    const deltas2 = deltas.slice(1).map((v, i) => deltas[i] - v)
                    const optimalK = deltas2.indexOf(Math.max(...deltas2)) + 2
                    return optimalK
                  })()}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Cluster Distribution */}
        <div className="card animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cluster Distribution</h2>
          <p className="text-gray-600 text-sm mb-4">
            Visualizing how customers are distributed across different segments based on spending score and income.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <svg viewBox="0 0 600 400" className="w-full">
              {/* Background */}
              <rect x="50" y="50" width="500" height="280" fill="#f9fafb" stroke="#e5e7eb" />
              
              {/* Scatter points - simulating customer distribution */}
              {Array.from({ length: 50 }).map((_, i) => {
                const cluster = Math.floor(i / 10)
                const angles = [
                  { x: 0.2, y: 0.3 },
                  { x: 0.8, y: 0.7 },
                  { x: 0.5, y: 0.5 },
                  { x: 0.3, y: 0.7 },
                  { x: 0.7, y: 0.3 },
                ]
                const angle = angles[cluster] || angles[0]
                const x = 50 + (angle.x + (Math.random() - 0.5) * 0.2) * 500
                const y = 50 + (angle.y + (Math.random() - 0.5) * 0.2) * 280
                const colors = ['#3b82f6', '#10b981', '#d946ef', '#f59e0b', '#ef4444']
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="6"
                    fill={colors[cluster]}
                    opacity="0.7"
                  />
                )
              })}

              {/* Axis labels */}
              <text x="300" y="385" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                Annual Income (k$)
              </text>
              <text x="15" y="200" textAnchor="middle" transform="rotate(-90, 15, 200)" className="text-sm font-semibold fill-gray-700">
                Spending Score
              </text>

              {/* Legend */}
              <g transform="translate(450, 70)">
                <circle cx="5" cy="5" r="5" fill="#3b82f6" />
                <text x="15" y="9" className="text-xs fill-gray-700">Cluster 0</text>
                <circle cx="5" cy="25" r="5" fill="#10b981" />
                <text x="15" y="29" className="text-xs fill-gray-700">Cluster 1</text>
                <circle cx="5" cy="45" r="5" fill="#d946ef" />
                <text x="15" y="49" className="text-xs fill-gray-700">Cluster 2</text>
                <circle cx="5" cy="65" r="5" fill="#f59e0b" />
                <text x="15" y="69" className="text-xs fill-gray-700">Cluster 3</text>
                <circle cx="5" cy="85" r="5" fill="#ef4444" />
                <text x="15" y="89" className="text-xs fill-gray-700">Cluster 4</text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card animate-slide-up">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Age Distribution</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">18-30 years</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
              <span className="font-semibold">35%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">31-45 years</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <span className="font-semibold">45%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">46-60 years</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <span className="font-semibold">15%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">60+ years</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
              <span className="font-semibold">5%</span>
            </div>
          </div>
        </div>

        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Income Levels</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Low (<40k)</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <span className="font-semibold">30%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Medium (40-80k)</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              <span className="font-semibold">50%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">High (>80k)</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
              <span className="font-semibold">20%</span>
            </div>
          </div>
        </div>

        <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Spending Patterns</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Low (1-40)</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <span className="font-semibold">25%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Medium (41-70)</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <span className="font-semibold">45%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">High (71-100)</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <span className="font-semibold">30%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}