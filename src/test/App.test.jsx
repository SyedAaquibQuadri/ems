import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import App from '../App'
import { AuthContext } from '../context/AuthProvider'

// Mock child components to keep tests focused
vi.mock('../components/Auth/Login', () => ({
  default: () => <div>Login Page</div>
}))
vi.mock('../components/Dashboard/AdminDashboard', () => ({
  default: () => <div>Admin Dashboard</div>
}))
vi.mock('../components/Dashboard/EmployeeDashboard', () => ({
  default: () => <div>Employee Dashboard</div>
}))

const renderApp = (currentUser, loading = false) => {
  return render(
    <AuthContext.Provider value={{ currentUser, loading }}>
      <App />
    </AuthContext.Provider>
  )
}

describe('App Component', () => {

  it('shows loading screen when loading', () => {
    renderApp(null, true)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows login when no user', () => {
    renderApp(null, false)
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('shows admin dashboard for admin user', () => {
    renderApp({ role: 'admin', name: 'Admin' }, false)
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
  })

  it('shows employee dashboard for employee user', () => {
    renderApp({ role: 'employee', name: 'Alice' }, false)
    expect(screen.getByText('Employee Dashboard')).toBeInTheDocument()
  })
})