import { useState } from 'react'
import { auth } from '../../utils/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import api from '../../utils/api'

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [state, setState] = useState('form') // 'form' | 'google' | 'sent'

  const handleSubmit = async (e) => {
  e.preventDefault()
  if (!email) {
    setToast({ type: 'error', msg: 'Please enter your email address.' })
    return
  }

  setLoading(true)
  setToast(null)

  try {
    const res = await api.post('/auth/forgot-password', { email })
    setState('sent')
  } catch (err) {
    const msg = err.response?.data?.message
    if (msg === 'google_account') {
      setState('google')
    } else {
      setToast({ type: 'error', msg: msg || 'Something went wrong.' })
    }
  } finally {
    setLoading(false)
  }
}

  const tryAgain = () => {
    setState('form')
    setEmail('')
    setToast(null)
  }

  // ── SENT STATE ──
  if (state === 'sent') return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-[#0f0f0f] px-4 py-8'>
      <div className='bg-[#181818] border border-[#2a2a2a] rounded-2xl p-7 w-full max-w-sm'>
        <div className='w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center mx-auto mb-5'>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
          </svg>
        </div>
        <h1 className='text-white text-center text-2xl font-medium mb-1'>Check your inbox</h1>
        <p className='text-gray-500 text-center text-sm mb-8'>
          If <span className='text-gray-300'>{email}</span> is registered, a reset link is on its way. Check spam too.
        </p>
        <div className='bg-emerald-950 border border-emerald-700 text-emerald-300 text-sm text-center px-4 py-2.5 rounded-xl mb-5'>
          Reset email sent successfully
        </div>
        <button onClick={tryAgain}
          className='w-full border border-[#2a2a2a] hover:border-[#4b5563] hover:bg-[#1f1f1f] text-gray-400 py-3.5 rounded-xl text-sm transition-all cursor-pointer mb-4'>
          Try a different email
        </button>
        <p className='text-center text-gray-600 text-sm'>
          <button onClick={onBack} className='text-emerald-500 hover:text-emerald-400 transition-colors'>
            ← Back to login
          </button>
        </p>
      </div>
    </div>
  )

  // ── GOOGLE ACCOUNT STATE ──
  if (state === 'google') return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-[#0f0f0f] px-4 py-8'>
      <div className='bg-[#181818] border border-[#2a2a2a] rounded-2xl p-7 w-full max-w-sm'>
        <div className='w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center mx-auto mb-5'>
          <svg className='w-6 h-6' viewBox='0 0 24 24'>
            <path fill='#fff' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
            <path fill='#fff' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
            <path fill='#fff' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'/>
            <path fill='#fff' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
          </svg>
        </div>
        <h1 className='text-white text-center text-2xl font-medium mb-1'>Google account</h1>
        <p className='text-gray-500 text-center text-sm mb-8'>No password needed for this account</p>
        <div className='bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-4 mb-5'>
          <p className='text-gray-400 text-sm leading-relaxed'>
            <span className='text-gray-200 font-medium'>{email}</span> was signed up with Google.
            There is no password to reset — just use the Google button to sign in.
          </p>
        </div>
        <button
          onClick={onBack}
          className='w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium py-3.5 rounded-xl transition-all cursor-pointer mb-3'>
          Back to login
        </button>
        <button onClick={tryAgain}
          className='w-full border border-[#2a2a2a] hover:border-[#4b5563] hover:bg-[#1f1f1f] text-gray-400 py-3.5 rounded-xl text-sm transition-all cursor-pointer'>
          Try a different email
        </button>
      </div>
    </div>
  )

  // ── DEFAULT FORM STATE ──
  return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-[#0f0f0f] px-4 py-8'>
      <div className='bg-[#181818] border border-[#2a2a2a] rounded-2xl p-7 w-full max-w-sm'>

        <div className='w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center mx-auto mb-5'>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
          </svg>
        </div>

        <h1 className='text-white text-center text-2xl font-medium mb-1'>Forgot password?</h1>
        <p className='text-gray-500 text-center text-sm mb-8'>Enter your email and we'll send a reset link</p>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Email address</label>
            <div className='flex items-center gap-2 bg-[#111] border border-[#2a2a2a] rounded-xl px-3 focus-within:border-emerald-600 transition-colors'>
              <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4 text-gray-600 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
              </svg>
              <input
                type='email'
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='you@example.com'
                className='bg-transparent outline-none text-white text-sm py-3.5 w-full placeholder:text-gray-700'
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-60'>
            {loading ? 'Checking...' : 'Send reset link'}
          </button>

          {toast && (
            <div className={`text-sm text-center px-4 py-2.5 rounded-xl border ${
              toast.type === 'success'
                ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                : 'bg-red-950 border-red-700 text-red-300'
            }`}>
              {toast.msg}
            </div>
          )}
        </form>

        <p className='text-center text-gray-600 text-sm mt-6'>
          Remember it?{' '}
          <button onClick={onBack} className='text-emerald-500 hover:text-emerald-400 transition-colors'>
            Back to login
          </button>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword