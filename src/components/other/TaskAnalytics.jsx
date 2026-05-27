import React, { useEffect, useState } from 'react'
import api from '../../utils/api'

const formatTime = (ms) => {
  if (!ms || ms <= 0) return '—'
  const secs = Math.floor(ms / 1000)
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

const TaskAnalytics = () => {
  const [analytics, setAnalytics] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/tasks/analytics')
        setAnalytics(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return null
  if (analytics.length === 0) return (
    <div className='mt-6'>
      <p className='text-xs font-medium tracking-widest text-gray-500 uppercase mb-3'>Task Analytics</p>
      <div className='bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl px-5 py-8 text-center'>
        <p className='text-gray-600 text-sm'>No completed or failed tasks yet</p>
      </div>
    </div>
  )

  return (
    <div className='mt-6'>
      <p className='text-xs font-medium tracking-widest text-gray-500 uppercase mb-3'>Task Analytics</p>

      {/* Summary table */}
      <div className='bg-[#1c1c1c] rounded-xl border border-[#2a2a2a] overflow-hidden overflow-x-auto mb-4'>
        <div className='min-w-[600px]'>
          {/* Header */}
          <div className='flex items-center px-5 py-3 bg-[#161616] border-b border-[#2a2a2a]'>
            <span className='flex-[2] text-xs font-medium tracking-widest text-gray-500 uppercase'>Employee</span>
            <span className='flex-1 text-center text-xs font-medium tracking-widest text-gray-500 uppercase'>Total</span>
            <span className='flex-1 text-center text-xs font-medium tracking-widest text-gray-500 uppercase'>Completed</span>
            <span className='flex-1 text-center text-xs font-medium tracking-widest text-gray-500 uppercase'>Failed</span>
            <span className='flex-1 text-center text-xs font-medium tracking-widest text-gray-500 uppercase'>Avg Time</span>
            <span className='flex-1 text-center text-xs font-medium tracking-widest text-gray-500 uppercase'>Details</span>
          </div>

          {/* Rows */}
          {analytics.map((item, idx) => (
            <div key={item.employee._id}>
              <div className='flex items-center px-5 py-3.5 border-b border-[#222] last:border-0 hover:bg-[#222] transition-colors'>
                <div className='flex-[2] flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-[#1a3a2a] border border-emerald-800 text-emerald-400 flex items-center justify-center text-xs font-medium flex-shrink-0'>
                    {item.employee.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-white'>{item.employee.name}</p>
                    <p className='text-xs text-gray-600'>{item.employee.email}</p>
                  </div>
                </div>
                <div className='flex-1 flex justify-center'>
                  <span className='text-xs font-medium px-3 py-1 rounded-full bg-[#2a2a2a] text-gray-300 min-w-[36px] text-center'>
                    {item.totalTasks}
                  </span>
                </div>
                <div className='flex-1 flex justify-center'>
                  <span className='text-xs font-medium px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 min-w-[36px] text-center'>
                    {item.completedTasks}
                  </span>
                </div>
                <div className='flex-1 flex justify-center'>
                  <span className='text-xs font-medium px-3 py-1 rounded-full bg-red-950 text-red-400 min-w-[36px] text-center'>
                    {item.failedTasks}
                  </span>
                </div>
                <div className='flex-1 flex justify-center'>
                  <span className='text-xs font-medium text-amber-400'>
                    {formatTime(item.avgTimeMs)}
                  </span>
                </div>
                <div className='flex-1 flex justify-center'>
                  <button
                    onClick={() => setExpanded(expanded === item.employee._id ? null : item.employee._id)}
                    className='text-xs font-medium px-3 py-1.5 rounded-lg bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white transition-colors flex items-center gap-1'>
                    {expanded === item.employee._id ? 'Hide' : 'View'}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 transition-transform ${expanded === item.employee._id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded task details */}
              {expanded === item.employee._id && (
                <div className='bg-[#161616] border-b border-[#2a2a2a] px-5 py-4'>
                  <p className='text-xs text-gray-500 mb-3 uppercase tracking-widest'>Task breakdown</p>
                  <div className='space-y-2'>
                    {item.tasks.map(task => (
                      <div key={task._id} className='flex items-center justify-between bg-[#1c1c1c] rounded-lg px-4 py-3 border border-[#2a2a2a]'>
                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                            task.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-red-950 text-red-400 border border-red-900'
                          }`}>
                            {task.status}
                          </span>
                          <span className='text-sm text-white truncate'>{task.title}</span>
                          <span className={`text-xs flex-shrink-0 ${
                            task.priority === 'high' ? 'text-red-400' :
                            task.priority === 'medium' ? 'text-yellow-400' : 'text-emerald-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className='flex items-center gap-4 ml-4 flex-shrink-0'>
                          <div className='text-right hidden sm:block'>
                            <p className='text-xs text-gray-600'>Accepted</p>
                            <p className='text-xs text-gray-400'>
                              {task.acceptedAt ? new Date(task.acceptedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                            </p>
                          </div>
                          <div className='text-right hidden sm:block'>
                            <p className='text-xs text-gray-600'>Completed</p>
                            <p className='text-xs text-gray-400'>
                              {task.completedAt ? new Date(task.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                            </p>
                          </div>
                          <div className='text-right'>
                            <p className='text-xs text-gray-600'>Time taken</p>
                            <p className='text-xs font-medium text-amber-400'>{formatTime(task.timeMs)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaskAnalytics