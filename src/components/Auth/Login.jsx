import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import ForgotPassword from './ForgotPassword'

const Login = ({ onSwitchToRegister }) => {
  const { login } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [showSuperAdmin, setShowSuperAdmin] = useState(false)
  const [superAdminCode, setSuperAdminCode] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const getStrength = (val) => {
    let score = 0
    if (val.length >= 6) score++
    if (val.length >= 10) score++
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++
    if (/[^A-Za-z0-9]/.test(val)) score++
    return score
  }
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e']
  const strength = getStrength(password)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        setShowSuperAdmin(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setToast({ type: 'error', msg: 'Please fill in all fields.' })
      return
    }
    setLoading(true)
    setToast(null)
    try {
      await login(email, password, superAdminCode || undefined)
    } catch (err) {
      setToast({ type: 'error', msg: err.response?.data?.message || 'Invalid credentials' })
    } finally {
      setLoading(false)
    }
  }

  if (showForgotPassword) return <ForgotPassword onBack={() => setShowForgotPassword(false)} />

  return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-[#0f0f0f] px-4 py-8'>
      <div className='bg-[#181818] border border-[#2a2a2a] rounded-2xl p-7 w-full max-w-sm'>

        <div className='w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center mx-auto mb-5'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <h1 className='text-white text-center text-2xl font-medium mb-1'>Welcome back</h1>
        <p className='text-gray-500 text-center text-sm mb-8'>Sign in to continue to your account</p>

        <form onSubmit={submitHandler} className='flex flex-col gap-4'>
          <div>
            <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Email address</label>
            <div className='flex items-center gap-2 bg-[#111] border border-[#2a2a2a] rounded-xl px-3 focus-within:border-emerald-600 transition-colors'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder='you@example.com'
                className='bg-transparent outline-none text-white text-sm py-3.5 w-full placeholder:text-gray-700' />
            </div>
          </div>

          <div>
            <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Password</label>
            <div className='flex items-center gap-2 bg-[#111] border border-[#2a2a2a] rounded-xl px-3 focus-within:border-emerald-600 transition-colors'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <input type={showPassword ? 'text' : 'password'} required value={password}
                onChange={e => setPassword(e.target.value)} placeholder='Enter your password'
                className='bg-transparent outline-none text-white text-sm py-3.5 w-full placeholder:text-gray-700' />
              <button type='button' onClick={() => setShowPassword(p => !p)} className='text-gray-600 hover:text-gray-300 transition-colors shrink-0'>
                {showPassword
                  ? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                }
              </button>
            </div>
            {password && (
              <div className='flex gap-1 mt-2'>
                {[1,2,3,4].map(i => (
                  <div key={i} className='h-1 flex-1 rounded-full transition-all duration-300'
                    style={{ background: i <= strength ? strengthColors[strength] : '#2a2a2a' }} />
                ))}
              </div>
            )}
          </div>

          <div className='text-right -mt-2'>
            <button type='button' onClick={() => setShowForgotPassword(true)}
              className='text-emerald-500 text-sm hover:text-emerald-400 transition-colors'>
              Forgot password?
            </button>
          </div>

          {showSuperAdmin && (
            <div>
              <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Super Admin Code</label>
              <div className='flex items-center gap-2 bg-[#111] border border-yellow-800 rounded-xl px-3 focus-within:border-yellow-600 transition-colors'>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <input type='password' value={superAdminCode} onChange={e => setSuperAdminCode(e.target.value)}
                  placeholder='Enter super admin code'
                  className='bg-transparent outline-none text-yellow-400 text-sm py-3.5 w-full placeholder:text-gray-700' />
              </div>
            </div>
          )}

          <button type='submit' disabled={loading}
            className='bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-60'>
            {loading ? 'Signing in...' : 'Log in'}
          </button>

          {toast && (
            <div className={`text-sm text-center px-4 py-2.5 rounded-xl border ${toast.type === 'success' ? 'bg-emerald-950 border-emerald-700 text-emerald-300' : 'bg-red-950 border-red-700 text-red-300'}`}>
              {toast.msg}
            </div>
          )}
        </form>

        <div className='flex items-center gap-3 my-5'>
          <div className='flex-1 h-px bg-[#2a2a2a]' />
          <span className='text-gray-600 text-sm'>or</span>
          <div className='flex-1 h-px bg-[#2a2a2a]' />
        </div>

        <button
          onClick={() => window.location.href = `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/api/auth/google`}
          className='w-full border border-[#2a2a2a] hover:border-[#4b5563] hover:bg-[#1f1f1f] text-gray-300 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer'>
          <svg className='w-4 h-4' viewBox='0 0 24 24'>
            <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
            <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
            <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'/>
            <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
          </svg>
          Continue with Google
        </button>

        <p className='text-center text-gray-600 text-sm mt-5'>
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className='text-emerald-500 hover:text-emerald-400 transition-colors'>
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login