import React, { useState } from 'react'
import { Image, Download, Loader, Wand2, Sparkles } from 'lucide-react'
import axios from 'axios'

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageHistory, setImageHistory] = useState([])

  const generateImage = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    setLoading(true)
    try {
      const response = await axios.post('/api/images/generate', { prompt })
      const newImage = {
        id: Date.now(),
        url: response.data.imageUrl,
        prompt: prompt,
        timestamp: new Date()
      }
      
      setGeneratedImage(newImage)
      setImageHistory(prev => [newImage, ...prev])
    } catch (error) {
      console.error('Failed to generate image:', error)
    }
    setLoading(false)
  }

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  const examplePrompts = [
    "A serene mountain landscape at sunset",
    "A futuristic city with flying cars",
    "A magical forest with glowing mushrooms",
    "A cute robot reading a book"
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Wand2 className="h-10 w-10 text-purple-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">AI Image Generator</h1>
        </div>
        <p className="text-gray-600">Create stunning images from text descriptions</p>
      </div>

      {/* Generation Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <form onSubmit={generateImage} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Describe the image you want to create
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="A beautiful sunset over the ocean with waves crashing on the shore..."
              disabled={loading}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Quick ideas:</span>
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPrompt(example)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Generating Image...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate Image</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Image Display */}
      {generatedImage && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Image</h3>
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={generatedImage.url}
                alt={generatedImage.prompt}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  onClick={() => downloadImage(generatedImage.url, `ai-image-${generatedImage.id}.png`)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Prompt:</p>
              <p className="text-gray-900">{generatedImage.prompt}</p>
            </div>
          </div>
        </div>
      )}

      {/* Image History */}
      {imageHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Generations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageHistory.map((image) => (
              <div key={image.id} className="space-y-3">
                <div className="relative group">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => downloadImage(image.url, `ai-image-${image.id}.png`)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 p-2 rounded-full"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-900 line-clamp-2">{image.prompt}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(image.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGenerator
