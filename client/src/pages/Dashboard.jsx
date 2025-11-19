import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { MessageSquare, Image, FileText, Activity, TrendingUp, Users, Brain } from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalChats: 0,
    imagesGenerated: 0,
    documentsAnalyzed: 0,
    activeUsers: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const features = [
    {
      title: 'AI Chat Assistant',
      description: 'Have intelligent conversations with advanced AI models',
      icon: MessageSquare,
      href: '/chat',
      color: 'bg-blue-500',
      stat: stats.totalChats,
      statLabel: 'Total Conversations'
    },
    {
      title: 'Image Generation',
      description: 'Create stunning images from text descriptions',
      icon: Image,
      href: '/images',
      color: 'bg-green-500',
      stat: stats.imagesGenerated,
      statLabel: 'Images Created'
    },
    {
      title: 'Document Analysis',
      description: 'Analyze and extract insights from documents',
      icon: FileText,
      href: '/documents',
      color: 'bg-purple-500',
      stat: stats.documentsAnalyzed,
      statLabel: 'Documents Processed'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Dashboard</h1>
        <p className="mt-2 text-gray-600">Explore powerful AI features and tools</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Interactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.totalChats + stats.imagesGenerated + stats.documentsAnalyzed) || 0 }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">+24%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-indigo-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">AI Models</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link
              key={feature.title}
              to={feature.href}
              className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className={`inline-flex p-3 rounded-lg ${feature.color} bg-opacity-10 mb-4`}>
                  <Icon className={`h-6 w-6 text-white`} style={{ color: feature.color.replace('bg-', '').replace('-500', '') }} />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{feature.statLabel}</span>
                  <span className="font-semibold text-gray-900">{feature.stat}</span>
                </div>
              </div>

              <div className={`h-1 ${feature.color}`}></div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/chat"
            className="flex items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <MessageSquare className="h-5 w-5 text-blue-500 mr-3" />
            <span className="text-gray-700">Start New Chat</span>
          </Link>
          
          <Link
            to="/images"
            className="flex items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <Image className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-gray-700">Generate Image</span>
          </Link>
          
          <Link
            to="/documents"
            className="flex items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <FileText className="h-5 w-5 text-purple-500 mr-3" />
            <span className="text-gray-700">Analyze Document</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
