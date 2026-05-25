import React, { createContext, useState, useEffect } from 'react'
import api from '../utils/api'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        if (token) {
          localStorage.setItem('authToken', token)
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

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setCurrentUser(data)
    return data
  }

  const logout = async () => {
  try {
    await api.post('/auth/logout')
  } catch {
    // ignore errors — just clear local state
  }
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