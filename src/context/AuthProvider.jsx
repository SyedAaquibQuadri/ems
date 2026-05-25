import React, { createContext, useState, useEffect } from 'react'
import api from '../utils/api'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on page load
  jsxuseEffect(() => {
  const checkAuth = async () => {
    try {
      // Check for Google OAuth token in URL
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')

      if (token) {
        // Store token in localStorage for cross-domain use
        localStorage.setItem('authToken', token)
        // Clean URL
        window.history.replaceState({}, '', '/')
      }

      const { data } = await api.get('/auth/me')
      setCurrentUser(data)
    } catch {
      setCurrentUser(null)
    } finally {
      setLoading(false)
    }
  }
  checkAuth()
}, [])

  const logout = async () => {
  await api.post('/auth/logout')
  localStorage.removeItem('authToken')
  setCurrentUser(null)
}


  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider