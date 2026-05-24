import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Header from '../components/other/Header'
import { AuthContext } from '../context/AuthProvider'

const mockLogout = vi.fn()

const renderHeader = (name = 'Admin User') => {
  return render(
    <AuthContext.Provider value={{
      currentUser: { name, role: 'admin' },
      logout: mockLogout
    }}>
      <Header />
    </AuthContext.Provider>
  )
}

describe('Header Component', () => {

  beforeEach(() => {
    mockLogout.mockClear()
  })

  it('renders user name correctly', () => {
    renderHeader('Alice Johnson')
    expect(screen.getByText('Alice Johnson 👋')).toBeInTheDocument()
  })

  it('renders correct initials', () => {
    renderHeader('Bob Smith')
    expect(screen.getByText('BO')).toBeInTheDocument()
  })

  it('calls logout when log out button clicked', async () => {
    mockLogout.mockResolvedValue()
    renderHeader()
    fireEvent.click(screen.getByText('Log out'))
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1)
    })
  })
})