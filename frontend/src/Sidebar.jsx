import { useState, useEffect, useRef } from 'react'
import { Home, Users, Calendar, Trophy, Settings } from 'lucide-react'

const navItems = [
  { label: 'Home', href: '#home', icon: Home, page: 'home' },
  { label: 'Athletes', href: '#athletes', icon: Users, page: 'athletes' },
  { label: 'Schedule', href: '#schedule', icon: Calendar, page: 'schedule' },
  { label: 'Results', href: '#results', icon: Trophy, page: 'results' },
]

const adminItem = { label: 'Admin', href: '#login', icon: Settings, page: 'admin' }

function Sidebar({ currentPage }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(min-width: 1024px)').matches
    }
    return true
  })
  const sidebarRef = useRef(null)
  const toggleButtonRef = useRef(null)

  // Track if we're on desktop (lg breakpoint = 1024px)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mediaQuery.matches)

    const handler = (e) => setIsDesktop(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Handle Escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        toggleButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Focus trap when sidebar is open
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      const focusableElements = sidebarRef.current.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      const handleTab = (e) => {
        if (e.key !== 'Tab') return
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }

      firstElement?.focus()
      document.addEventListener('keydown', handleTab)
      return () => document.removeEventListener('keydown', handleTab)
    }
  }, [isOpen])

  const isActive = (page) => {
    if (page === 'home' && (!currentPage || currentPage === 'home' || currentPage === '')) {
      return true
    }
    if (page === 'schedule' && (currentPage === 'schedule' || currentPage === 'meets')) {
      return true
    }
    return currentPage === page
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        ref={toggleButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="sidebar-nav"
      >
        <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="sidebar-nav"
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0
        `}
        aria-label="Main navigation"
        aria-hidden={!isDesktop && !isOpen ? true : undefined}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg" aria-hidden="true">
              <span className="text-white font-extrabold text-lg">JC</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Jones County</h2>
              <p className="text-xs text-green-400 font-semibold uppercase tracking-wider">Cross Country</p>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Primary" className="flex-1">
            <ul className="space-y-1" role="list">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.page)

                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      tabIndex={isDesktop || isOpen ? 0 : -1}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset
                        ${active
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }
                      `}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Admin Link */}
          <div className="pt-6 border-t border-gray-800">
            <a
              href={adminItem.href}
              onClick={() => setIsOpen(false)}
              tabIndex={isDesktop || isOpen ? 0 : -1}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 font-medium hover:bg-gray-800 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
            >
              <Settings className="h-5 w-5" />
              Admin
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
