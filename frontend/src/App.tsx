import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import SinglePrediction from './pages/SinglePrediction'
import BatchSegment from './pages/BatchSegment'
import DataVisualization from './pages/DataVisualization'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/predict" element={<SinglePrediction />} />
          <Route path="/batch" element={<BatchSegment />} />
          <Route path="/visualization" element={<DataVisualization />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App