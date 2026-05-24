import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Login from '../components/Auth/Login'
import { AuthContext } from '../context/AuthProvider'

// Mock the login function
const mockLogin = vi.fn()

const renderLogin = () => {
  return render(
    <AuthContext.Provider value={{ login: mockLogin }}>
      <Login />
    </AuthContext.Provider>
  )
}

describe('Login Component', () => {

  beforeEach(() => {
    mockLogin.mockClear()
  })

  it('renders login form correctly', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByText('Log in')).toBeInTheDocument()
  })

  it('shows error when fields are empty', async () => {
  renderLogin()

  // Submit form directly bypassing required attribute
  const form = document.querySelector('form')
  fireEvent.submit(form)

  await waitFor(() => {
    expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument()
  })
})

  it('calls login with email and password', async () => {
    mockLogin.mockResolvedValue({ role: 'admin' })
    renderLogin()

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'admin@ems.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'admin123' }
    })
    fireEvent.click(screen.getByText('Log in'))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@ems.com', 'admin123')
    })
  })

  it('shows error message on failed login', async () => {
    mockLogin.mockRejectedValue({
      response: { data: { message: 'Invalid email or password' } }
    })
    renderLogin()

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'wrong@ems.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpass' }
    })
    fireEvent.click(screen.getByText('Log in'))

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })
  })

  it('shows password strength bar when typing', () => {
    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'abc' }
    })
    // strength bar divs appear
    const bars = document.querySelectorAll('.h-1')
    expect(bars.length).toBe(4)
  })
})