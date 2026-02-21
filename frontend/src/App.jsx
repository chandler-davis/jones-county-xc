import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import Sidebar from './Sidebar'
import {
  HomePage,
  AthletesPage,
  SchedulePage,
  ResultsPage,
  LoginPage,
  AdminDashboard,
  AdminAthletesPage,
} from './pages'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const { isAuthenticated, isLoading, logout } = useAuth()

  // Handle hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').split('?')[0] || 'home'
      setCurrentPage(hash)
    }

    // Set initial page
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Handle login page redirect after successful login
  const handleLoginSuccess = () => {
    window.location.hash = '#admin'
  }

  // Show loading state while checking auth
  if (isLoading && currentPage.startsWith('admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Render login page
  if (currentPage === 'login') {
    if (isAuthenticated) {
      // Already logged in, redirect to admin
      window.location.hash = '#admin'
      return null
    }
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  // Render admin pages (protected)
  if (currentPage.startsWith('admin')) {
    if (!isAuthenticated) {
      // Not logged in, redirect to login
      window.location.hash = '#login'
      return null
    }

    // Admin sub-routes
    const renderAdminPage = () => {
      switch (currentPage) {
        case 'admin-athletes':
          return <AdminAthletesPage />
        case 'admin':
        default:
          return <AdminDashboard />
      }
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <header className="bg-gray-900 text-white sticky top-0 z-40 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <a href="#admin" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/30 transition-shadow">
                    <span className="text-white font-bold text-sm">JC</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-lg font-bold">Admin</span>
                    <span className="text-gray-400 text-lg font-light ml-1">Dashboard</span>
                  </div>
                </a>
                <nav className="hidden md:flex items-center gap-1">
                  <a
                    href="#admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === 'admin'
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    Overview
                  </a>
                  <a
                    href="#admin-athletes"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === 'admin-athletes'
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    Athletes
                  </a>
                </nav>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="#home"
                  className="px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  View Site
                </a>
                <div className="w-px h-6 bg-gray-700 mx-1"></div>
                <button
                  onClick={async () => {
                    await logout()
                    window.location.hash = '#login'
                  }}
                  className="px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderAdminPage()}
        </main>
      </div>
    )
  }

  // Render public pages
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
      case '':
        return <HomePage />
      case 'athletes':
        return <AthletesPage />
      case 'schedule':
      case 'meets':
        return <SchedulePage />
      case 'results':
        return <ResultsPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar currentPage={currentPage} />
      <div className="flex-1">
        <main className="p-6 lg:p-8 max-w-7xl mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
