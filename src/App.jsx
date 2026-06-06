import React, { useContext, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import Homepage from './components/Homepage'
import { AuthContext } from './context/AuthProvider'
import SuperAdminDashboard from './components/Dashboard/SuperAdminDashboard'
import ResetPassword from './components/Auth/ResetPassword'
import CompanySetup from './components/CompanySetup'
import PendingApproval from './components/PendingApproval'

const isAdmin = (user) =>
  user?.role === 'admin' ||
  user?.role === 'org_admin' ||
  user?.role === 'super_admin'

const App = () => {
  const { currentUser, loading } = useContext(AuthContext)
  const [authPage, setAuthPage] = useState('login')

  if (loading) return (
    <div className='flex h-screen w-screen items-center justify-center bg-[#0f0f0f]'>
      <p className='text-gray-500 text-sm'>Loading...</p>
    </div>
  )

  return (
    <Routes>
      <Route path='/' element={
        currentUser ? <Navigate to='/dashboard' /> : <Homepage />
      } />
      <Route path='/login' element={
        currentUser ? <Navigate to='/dashboard' /> :
        authPage === 'register'
          ? <Register onSwitchToLogin={() => setAuthPage('login')} />
          : <Login onSwitchToRegister={() => setAuthPage('register')} />
      } />
      <Route path='/register' element={
        currentUser ? <Navigate to='/dashboard' /> :
        <Register onSwitchToLogin={() => setAuthPage('login')} />
      } />
      <Route path='/dashboard' element={
        !currentUser ? <Navigate to='/login' /> :
        currentUser.role === 'pending' ? <Navigate to='/pending' /> :  // ← add this
        currentUser.role === 'super_admin' ? <SuperAdminDashboard /> :
        isAdmin(currentUser) ? <AdminDashboard /> :
        <EmployeeDashboard />
      } />
      <Route path='/reset-password/:token' element={<ResetPassword />} />
      <Route path='/company-setup' element={
        !currentUser
          ? <Navigate to='/login' />
          : currentUser.role !== 'org_admin' || currentUser.organizationId
            ? <Navigate to='/dashboard' />  // already set up, or wrong role
            : <CompanySetup />
      } />
      <Route path='/pending' element={
        !currentUser
          ? <Navigate to='/login' />
          : currentUser.role !== 'pending'
            ? <Navigate to='/dashboard' />
            : <PendingApproval />
       } />
    </Routes>
  )
}

export default App