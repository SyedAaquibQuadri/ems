import React, { useEffect, useState } from 'react'
import Header from '../other/Header'
import TaskListNumbers from '../other/TaskListNumbers'
import TaskList from '../TaskList/TaskList'
import api from '../../utils/api'

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([])
  const [summary, setSummary] = useState({ new: 0, active: 0, completed: 0, failed: 0 })
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
  try {
    const { data } = await api.get('/tasks/my')
    setTasks(data.tasks)
    setSummary({
      newTask: data.summary.new,       // ← map 'new' → 'newTask'
      active: data.summary.active,
      completed: data.summary.completed,
      failed: data.summary.failed,
    })
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => { fetchTasks() }, [])

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status })
      fetchTasks() // refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task')
    }
  }

  if (loading) return (
    <div className='flex h-screen items-center justify-center bg-[#1C1C1C]'>
      <p className='text-gray-500 text-sm'>Loading...</p>
    </div>
  )

  return (
    <div className='p-10 bg-[#1C1C1C] h-screen'>
      <Header />
      <TaskListNumbers summary={summary} />
      <TaskList tasks={tasks} onStatusUpdate={handleStatusUpdate} />
    </div>
  )
}

export default EmployeeDashboard