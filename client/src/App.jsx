import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
// import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import AIChat from './pages/AIChat'
import ImageGenerator from './pages/ImageGenerator'
import DocumentAnalyzer from './pages/DocumentAnalyzer'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {

  return (
    <BrowserRouter>
      {/* <AuthProvider> */}
        <Header />
        <main className="grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/images" element={<ImageGenerator />} />
            <Route path="/documents" element={<DocumentAnalyzer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      {/* </AuthProvider> */}
    </BrowserRouter>
  )
}

export default App
