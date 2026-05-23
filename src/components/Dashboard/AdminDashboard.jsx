import React, { useEffect, useState } from 'react'
import Header from '../other/Header'
import CreateTask from '../other/CreateTask'
import AllTask from '../other/AllTask'
import api from '../../utils/api'

const AdminDashboard = () => {
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
    <div className='h-screen w-full p-7 bg-[#0f0f0f]'>
      <Header />
      <CreateTask employees={employees} onTaskCreated={fetchData} />
      <AllTask tasks={tasks} />
    </div>
  )
}

export default AdminDashboard