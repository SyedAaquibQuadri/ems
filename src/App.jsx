import React, { useContext } from 'react'
import Login from './components/Auth/Login'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { AuthContext } from './context/AuthProvider'

const App = () => {
  const { currentUser, loading } = useContext(AuthContext)

  if (loading) return (
    <div className='flex h-screen w-screen items-center justify-center bg-[#0f0f0f]'>
      <p className='text-gray-500 text-sm'>Loading...</p>
    </div>
  )

  if (!currentUser) return <Login />

  if (currentUser.role === 'admin') return <AdminDashboard />

  return <EmployeeDashboard />
}

export default App