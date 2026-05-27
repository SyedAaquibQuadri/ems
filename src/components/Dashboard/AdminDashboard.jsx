import React, { useEffect, useState, useContext } from 'react'
import Header from '../other/Header'
import CreateTask from '../other/CreateTask'
import AllTask from '../other/AllTask'
import PendingUsers from '../other/PendingUsers'
import api from '../../utils/api'
import { AuthContext } from '../../context/AuthProvider'
import TaskAnalytics from '../other/TaskAnalytics'


const AdminDashboard = () => {
  const { currentUser } = useContext(AuthContext)  // ← moved inside component
  const [employees, setEmployees] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [empRes, taskRes] = await Promise.all([
        api.get('/users/employees'),
        api.get('/tasks'),
      ])
      setEmployees(empRes.data)
      setTasks(taskRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) return (
    <div className='flex h-screen items-center justify-center bg-[#0f0f0f]'>
      <p className='text-gray-500 text-sm'>Loading...</p>
    </div>
  )

  return (
    <div className='min-h-screen w-full p-4 md:p-7 bg-[#0f0f0f] overflow-y-auto'>
      <Header />
      {currentUser?.orgSlug && (
  <div className='mt-4 mb-2 flex items-center gap-3 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl px-5 py-3'>
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
    <div className='flex items-center gap-2 flex-1 flex-wrap'>
      <span className='text-sm text-gray-400'>Organization code:</span>
      <code className='text-sm text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800'>
        {currentUser.orgSlug}
      </code>
      <span className='text-xs text-gray-600'>Share this with employees to join your workspace</span>
    </div>
  </div>
)}
      <PendingUsers onApproved={fetchData} />
      <CreateTask employees={employees} onTaskCreated={fetchData} />
      <AllTask tasks={tasks} />
      <TaskAnalytics />
    </div>
  )
}

export default AdminDashboard