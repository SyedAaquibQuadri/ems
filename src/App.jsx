import React, { useContext, useState } from 'react'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { AuthContext } from './context/AuthProvider'

const App = () => {
  const { currentUser, loading } = useContext(AuthContext)
  const [authPage, setAuthPage] = useState('login') // 'login' | 'register'

  if (loading) return (
    <div className='flex h-screen w-screen items-center justify-center bg-[#0f0f0f]'>
      <p className='text-gray-500 text-sm'>Loading...</p>
    </div>
  )

  if (!currentUser) {
    if (authPage === 'register') {
      return <Register onSwitchToLogin={() => setAuthPage('login')} />
    }
    return <Login onSwitchToRegister={() => setAuthPage('register')} />
  }

  if (currentUser.role === 'admin') return <AdminDashboard />
  return <EmployeeDashboard />
}

export default App