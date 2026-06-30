import { useState } from 'react'
import { batchSegment } from '../services/api'
import { 
  UserGroupIcon,
  ClipboardDocumentIcon,
  TableCellsIcon 
} from '@heroicons/react/24/outline'

interface CustomerInput {
  age: number
  annual_income: number
  spending_score: number
}

export default function BatchSegment() {
  const [customers, setCustomers] = useState<CustomerInput[]>([{ age: 0, annual_income: 0, spending_score: 0 }])
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const addCustomer = () => {
    setCustomers([...customers, { age: 0, annual_income: 0, spending_score: 0 }])
  }

  const removeCustomer = (index: number) => {
    setCustomers(customers.filter((_, i) => i !== index))
  }

  const updateCustomer = (index: number, field: keyof CustomerInput, value: number) => {
    const updated = [...customers]
    updated[index][field] = value
    setCustomers(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await batchSegment(customers)
      setResults(response)
    } catch (error) {
      console.error('Error batch segmenting:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = () => {
    const sampleCustomers = [
      { age: 25, annual_income: 40, spending_score: 70 },
      { age: 35, annual_income: 80, spending_score: 20 },
      { age: 45, annual_income: 60, spending_score: 50 },
      { age: 23, annual_income: 25, spending_score: 85 },
      { age: 55, annual_income: 100, spending_score: 30 },
      { age: 30, annual_income: 55, spending_score: 60 },
      { age: 28, annual_income: 45, spending_score: 75 },
      { age: 40, annual_income: 70, spending_score: 45 },
    ]
    setCustomers(sampleCustomers)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold gradient-text mb-4">Batch Customer Segmentation</h1>
        <p className="text-lg text-gray-600">
          Analyze multiple customers at once and discover segment patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="card animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Customer List</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadSampleData}
                className="btn-secondary text-sm"
              >
                Load Sample Data
              </button>
              <button
                type="button"
                onClick={addCustomer}
                className="btn-primary text-sm"
              >
                + Add Customer
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
              {customers.map((customer, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">Customer {index + 1}</span>
                    {customers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCustomer(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="Age"
                      required
                      className="input-field text-sm"
                      value={customer.age || ''}
                      onChange={(e) => updateCustomer(index, 'age', parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      placeholder="Income (k$)"
                      required
                      className="input-field text-sm"
                      value={customer.annual_income || ''}
                      onChange={(e) => updateCustomer(index, 'annual_income', parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      placeholder="Spending Score"
                      required
                      className="input-field text-sm"
                      value={customer.spending_score || ''}
                      onChange={(e) => updateCustomer(index, 'spending_score', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || customers.length === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : `Analyze ${customers.length} Customers`}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {results && (
            <>
              {/* Summary Stats */}
              <div className="card animate-slide-up">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Analysis Summary</h3>
                <p className="text-gray-600 mb-4">
                  Optimal number of clusters: <span className="font-bold text-primary-600">{results.optimal_clusters}</span>
                </p>
                <div className="space-y-3">
                  {Object.entries(results.cluster_summary).map(([clusterId, data]: [string, any]) => (
                    <div key={clusterId} className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900">Cluster {clusterId}</h4>
                        <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {data.count} customers
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{data.description}</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Avg Age:</span>
                          <span className="font-semibold ml-1">{data.avg_age.toFixed(0)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg Income:</span>
                          <span className="font-semibold ml-1">${data.avg_income.toFixed(0)}k</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg Spending:</span>
                          <span className="font-semibold ml-1">{data.avg_spending.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results Table */}
              <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Individual Results</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">ID</th>
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Age</th>
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Income</th>
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Spending</th>
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Cluster</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.results.map((result: any) => (
                        <tr key={result.customer_id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3 text-sm">{result.customer_id}</td>
                          <td className="py-2 px-3 text-sm">{result.age}</td>
                          <td className="py-2 px-3 text-sm">${result.annual_income}k</td>
                          <td className="py-2 px-3 text-sm">{result.spending_score}</td>
                          <td className="py-2 px-3 text-sm">
                            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-semibold">
                              Cluster {result.cluster}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {!results && !loading && (
            <div className="card animate-slide-up text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500">Add customers and click analyze to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}