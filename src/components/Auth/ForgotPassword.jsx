import React, { useState } from 'react'
import { auth } from '../../utils/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [sent, setSent] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!email) {
      setToast({ type: 'error', msg: 'Please enter your email.' })
      return
    }
    setLoading(true)
    setToast(null)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err) {
        console.log('Firebase error code:', err.code)
      console.log('Firebase error message:', err.message)
      const msg =
        err.code === 'auth/user-not-found' ? 'No account found with that email.' :
        err.code === 'auth/invalid-email' ? 'Invalid email address.' :
        err.code === 'auth/too-many-requests' ? 'Too many requests. Try again later.' :
        `Error: ${err.code}`
      setToast({ type: 'error', msg })
    } finally {
      setLoading(false)
    }
  }

  if (sent) return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-[#0f0f0f] px-4'>
      <div className='bg-[#181818] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-sm text-center'>
        <div className='w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center mx-auto mb-4'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className='text-white text-xl font-medium mb-2'>Check your email</h2>
        <p className='text-gray-500 text-sm mb-6'>
          We sent a password reset link to <span className='text-white'>{email}</span>.
        </p>
        <button onClick={onBack} className='text-emerald-500 hover:text-emerald-400 text-sm transition-colors'>
          Back to login
        </button>
      </div>
    </div>
  )

  return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-[#0f0f0f] px-4'>
      <div className='bg-[#181818] border border-[#2a2a2a] rounded-2xl p-7 w-full max-w-sm'>
        <button onClick={onBack} className='flex items-center gap-1.5 text-gray-500 hover:text-white text-sm mb-6 transition-colors'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className='w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center mx-auto mb-5'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>

        <h1 className='text-white text-center text-2xl font-medium mb-1'>Forgot password?</h1>
        <p className='text-gray-500 text-center text-sm mb-8'>Enter your email and we'll send you a reset link</p>

        <form onSubmit={submitHandler} className='flex flex-col gap-4'>
          <div>
            <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Email address</label>
            <div className='flex items-center gap-2 bg-[#111] border border-[#2a2a2a] rounded-xl px-3 focus-within:border-emerald-600 transition-colors'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input type='email' value={email} onChange={e => setEmail(e.target.value)}
                placeholder='you@example.com'
                className='bg-transparent outline-none text-white text-sm py-3.5 w-full placeholder:text-gray-700' />
            </div>
          </div>

          <button type='submit' disabled={loading}
            className='bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-60'>
            {loading ? 'Sending...' : 'Send reset link'}
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

export default ForgotPassword