import { useState } from 'react'
import { FileText, Upload, Loader, Download, Eye, Trash2 } from 'lucide-react'
import axios from 'axios'

const DocumentAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analysisHistory, setAnalysisHistory] = useState([])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const analyzeDocument = async () => {
    if (!selectedFile || loading) return

    setLoading(true)
    const formData = new FormData()
    formData.append('document', selectedFile)

    try {
      const response = await axios.post('/api/documents/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const newAnalysis = {
        id: Date.now(),
        filename: selectedFile.name,
        fileSize: selectedFile.size,
        analysis: response.data.analysis,
        summary: response.data.summary,
        keyPoints: response.data.keyPoints,
        timestamp: new Date()
      }

      setAnalysis(newAnalysis)
      setAnalysisHistory(prev => [newAnalysis, ...prev])
    } catch (error) {
      console.error('Failed to analyze document:', error)
    }
    setLoading(false)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadAnalysis = (analysis) => {
    const content = `
Document Analysis Report
========================

File: ${analysis.filename}
Date: ${new Date(analysis.timestamp).toLocaleString()}

Summary:
${analysis.summary}

Key Points:
${analysis.keyPoints.map(point => `• ${point}`).join('\n')}

Detailed Analysis:
${analysis.analysis}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analysis-${analysis.filename}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <FileText className="h-10 w-10 text-green-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Document Analyzer</h1>
        </div>
        <p className="text-gray-600">Upload and analyze documents with AI</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            id="file-upload"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              Supports: TXT, PDF, DOC, DOCX (Max 10MB)
            </p>
          </label>
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                
                <button
                  onClick={analyzeDocument}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2 transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
            <button
              onClick={() => downloadAnalysis(analysis)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
          </div>

          <div className="space-y-6">
            {/* Summary */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {analysis.summary}
              </p>
            </div>

            {/* Key Points */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Points</h4>
              <ul className="space-y-2">
                {analysis.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detailed Analysis */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Detailed Analysis</h4>
              <div className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {analysis.analysis}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h3>
          <div className="space-y-4">
            {analysisHistory.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{item.filename}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => downloadAnalysis(item)}
                    className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentAnalyzer
