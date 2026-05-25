import React, { useEffect, useState } from 'react'
import api from '../../utils/api'

const PendingUsers = ({ onApproved }) => {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPending = async () => {
    try {
      const { data } = await api.get('/users/pending')
      setPending(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPending() }, [])

  const handleApprove = async (id) => {
    try {
      await api.patch(`/users/${id}/role`, { role: 'employee' })
      setPending(prev => prev.filter(u => u._id !== id))
      onApproved()
    } catch (err) {
      alert('Failed to approve user')
    }
  }

  const handleReject = async (id) => {
    try {
      await api.delete(`/users/${id}`)
      setPending(prev => prev.filter(u => u._id !== id))
    } catch (err) {
      alert('Failed to reject user')
    }
  }

  if (loading) return null
  if (pending.length === 0) return null

  return (
    <div className='mt-6'>
      <p className='text-xs font-medium tracking-widest text-gray-500 uppercase mb-3'>
        Pending Approvals
        <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-950 text-yellow-400 border border-yellow-800 text-xs'>
          {pending.length}
        </span>
      </p>
      <div className='bg-[#1c1c1c] rounded-xl border border-yellow-900/40 overflow-hidden'>
        {pending.map((user, idx) => (
          <div key={user._id} className='flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a] last:border-0 hover:bg-[#222] transition-colors'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-yellow-950 border border-yellow-800 text-yellow-400 flex items-center justify-center text-xs font-medium'>
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className='text-sm font-medium text-white'>{user.name}</p>
                <p className='text-xs text-gray-500'>{user.email}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => handleApprove(user._id)}
                className='text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-900 text-emerald-300 hover:bg-emerald-800 border border-emerald-800 transition-colors'>
                Approve
              </button>
              <button
                onClick={() => handleReject(user._id)}
                className='text-xs font-medium px-3 py-1.5 rounded-lg bg-red-950 text-red-400 hover:bg-red-900 border border-red-900 transition-colors'>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingUsers