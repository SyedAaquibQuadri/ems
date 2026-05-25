import React, { useState, useEffect } from 'react'

const TaskTimer = ({ acceptedAt, completedAt, stopped }) => {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!acceptedAt) return

    if (stopped && completedAt) {
      // Calculate final time
      const diff = new Date(completedAt) - new Date(acceptedAt)
      setElapsed(Math.floor(diff / 1000))
      return
    }

    // Calculate initial elapsed time (for page refresh persistence)
    const initial = Math.floor((Date.now() - new Date(acceptedAt)) / 1000)
    setElapsed(initial)

    if (stopped) return

    // Start live timer
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(acceptedAt)) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [acceptedAt, completedAt, stopped])

  const format = (secs) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    if (h > 0) return `${h}h ${m}m ${s}s`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
  }

  if (!acceptedAt) return null

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${stopped ? 'text-gray-500' : 'text-amber-400'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {stopped ? `Took ${format(elapsed)}` : format(elapsed)}
    </div>
  )
}

export default TaskTimer