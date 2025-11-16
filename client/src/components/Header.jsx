import { Link, useLocation } from 'react-router'
import { Brain, MessageSquare, Image, FileText, LogOut, User } from 'lucide-react'
// import { useAuth } from '../contexts/AuthContext'

const Header = () => {
//   const { user, logout } = useAuth()
const user = { name: 'John Doe' } // Placeholder user
const logout = () => {
  console.log('Logout function called') // Placeholder logout function
}
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Brain },
    { name: 'AI Chat', href: '/chat', icon: MessageSquare },
    { name: 'Image Generator', href: '/images', icon: Image },
    { name: 'Document Analyzer', href: '/documents', icon: FileText },
  ]

  if (!user) return null

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-gray-900">AI Web App</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="cursor-pointer flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
