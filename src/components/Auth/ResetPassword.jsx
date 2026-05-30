import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../utils/api'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [done, setDone] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setToast({ type: 'error', msg: 'Passwords do not match' })
      return
    }
    if (password.length < 6) {
      setToast({ type: 'error', msg: 'Password must be at least 6 characters' })
      return
    }
    setLoading(true)
    try {
      await api.put(`/auth/reset-password/${token}`, { password })
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setToast({ type: 'error', msg: err.response?.data?.message || 'Reset failed' })
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-[#0f0f0f] px-4'>
      <div className='bg-[#181818] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-sm text-center'>
        <div className='w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center mx-auto mb-4'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className='text-white text-xl font-medium mb-2'>Password reset!</h2>
        <p className='text-gray-500 text-sm'>Redirecting you to login...</p>
      </div>
    </div>
  )

  return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-[#0f0f0f] px-4'>
      <div className='bg-[#181818] border border-[#2a2a2a] rounded-2xl p-7 w-full max-w-sm'>
        <div className='w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center mx-auto mb-5'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className='text-white text-center text-2xl font-medium mb-1'>New password</h1>
        <p className='text-gray-500 text-center text-sm mb-8'>Enter your new password below</p>

        <form onSubmit={submitHandler} className='flex flex-col gap-4'>
          <div>
            <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>New password</label>
            <div className='flex items-center gap-2 bg-[#111] border border-[#2a2a2a] rounded-xl px-3 focus-within:border-emerald-600 transition-colors'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input type='password' value={password} onChange={e => setPassword(e.target.value)}
                placeholder='Min. 6 characters'
                className='bg-transparent outline-none text-white text-sm py-3.5 w-full placeholder:text-gray-700' />
            </div>
          </div>
          <div>
            <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Confirm password</label>
            <div className='flex items-center gap-2 bg-[#111] border border-[#2a2a2a] rounded-xl px-3 focus-within:border-emerald-600 transition-colors'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <input type='password' value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder='Repeat password'
                className='bg-transparent outline-none text-white text-sm py-3.5 w-full placeholder:text-gray-700' />
            </div>
          </div>

          <button type='submit' disabled={loading}
            className='bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-60'>
            {loading ? 'Resetting...' : 'Reset password'}
          </button>

          {toast && (
            <div className='text-sm text-center px-4 py-2.5 rounded-xl border bg-red-950 border-red-700 text-red-300'>
              {toast.msg}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ResetPassword