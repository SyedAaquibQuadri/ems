import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import api from '../../utils/api'

const Register = ({ onSwitchToLogin }) => {
  const { login, setCurrentUser } = useContext(AuthContext)
  const [mode, setMode] = useState(null) // 'create' | 'join'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [orgName, setOrgName] = useState('')
  const [orgSlug, setOrgSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const getStrength = (val) => {
    let score = 0
    if (val.length >= 6) score++
    if (val.length >= 10) score++
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++
    if (/[^A-Za-z0-9]/.test(val)) score++
    return score
  }
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e']
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strength = getStrength(password)

  const inputClass = 'bg-transparent outline-none text-white text-sm py-3.5 w-full placeholder:text-gray-700'
  const wrapClass = 'flex items-center gap-2 bg-[#111] border border-[#2a2a2a] rounded-xl px-3 focus-within:border-emerald-600 transition-colors'

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!name || !email || !password || !confirm) {
      setToast({ type: 'error', msg: 'Please fill in all fields.' })
      return
    }
    if (password !== confirm) {
      setToast({ type: 'error', msg: 'Passwords do not match.' })
      return
    }
    if (strength < 2) {
      setToast({ type: 'error', msg: 'Password is too weak.' })
      return
    }
    if (mode === 'create' && !orgName) {
      setToast({ type: 'error', msg: 'Please enter your organization name.' })
      return
    }
    if (mode === 'join' && !orgSlug) {
      setToast({ type: 'error', msg: 'Please enter the organization code.' })
      return
    }

    setLoading(true)
    setToast(null)

    try {
     if (mode === 'create') {
  const { data } = await api.post('/org/register', { orgName, name, email, password })
  if (data.token) localStorage.setItem('authToken', data.token)
  setCurrentUser(data)
} else {
        // Join org → pending
        await api.post('/org/join', { orgSlug, name, email, password })
        setToast({ type: 'success', msg: `Request sent! Wait for admin approval.` })
        setName(''); setEmail(''); setPassword(''); setConfirm(''); setOrgSlug('')
        setTimeout(() => onSwitchToLogin(), 3000)
      }
    } catch (err) {
      setToast({ type: 'error', msg: err.response?.data?.message || 'Something went wrong' })
    } finally {
      setLoading(false)
    }
  }

  // Mode selection screen
  if (!mode) {
    return (
      <div className='flex min-h-screen w-screen items-center justify-center bg-[#0f0f0f] px-4 py-8'>
        <div className='w-full max-w-sm'>
          <div className='text-center mb-8'>
            <div className='w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center mx-auto mb-5'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className='text-white text-2xl font-medium mb-2'>Get started</h1>
            <p className='text-gray-500 text-sm'>How would you like to join EMS?</p>
          </div>

          <div className='space-y-3'>
            {/* Create org */}
            <button onClick={() => setMode('create')}
              className='w-full bg-[#1c1c1c] border border-[#2a2a2a] hover:border-emerald-800 rounded-2xl p-5 text-left transition-all group'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center shrink-0 mt-0.5'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className='text-white font-medium mb-1'>Create an organization</p>
                  <p className='text-gray-500 text-sm leading-relaxed'>Start a new workspace for your team. You'll be the admin.</p>
                </div>
              </div>
            </button>

            {/* Join org */}
            <button onClick={() => setMode('join')}
              className='w-full bg-[#1c1c1c] border border-[#2a2a2a] hover:border-blue-800 rounded-2xl p-5 text-left transition-all group'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center shrink-0 mt-0.5'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className='text-white font-medium mb-1'>Join an organization</p>
                  <p className='text-gray-500 text-sm leading-relaxed'>Enter your company's org code to request access.</p>
                </div>
              </div>
            </button>
          </div>

          <p className='text-center text-gray-600 text-sm mt-6'>
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className='text-emerald-500 hover:text-emerald-400 transition-colors'>
              Sign in
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-[#0f0f0f] px-4 py-8'>
      <div className='bg-[#181818] border border-[#2a2a2a] rounded-2xl p-7 w-full max-w-sm'>

        {/* Back button */}
        <button onClick={() => { setMode(null); setToast(null) }}
          className='flex items-center gap-1.5 text-gray-500 hover:text-white text-sm mb-6 transition-colors'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Icon + title */}
        <div className={`w-11 h-11 rounded-xl ${mode === 'create' ? 'bg-emerald-600' : 'bg-blue-600'} flex items-center justify-center mx-auto mb-5`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mode === 'create'
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            }
          </svg>
        </div>

        <h1 className='text-white text-center text-2xl font-medium mb-1'>
          {mode === 'create' ? 'Create organization' : 'Join organization'}
        </h1>
        <p className='text-gray-500 text-center text-sm mb-6'>
          {mode === 'create' ? "You'll be the admin of your workspace" : "Request access to your company's workspace"}
        </p>

        <form onSubmit={submitHandler} className='flex flex-col gap-4'>

          {/* Org name (create) or org code (join) */}
          {mode === 'create' ? (
            <div>
              <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Organization name</label>
              <div className={wrapClass}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <input type='text' value={orgName} onChange={e => setOrgName(e.target.value)}
                  placeholder='Acme Corp' className={inputClass} />
              </div>
            </div>
          ) : (
            <div>
              <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Organization code</label>
              <div className={wrapClass}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <input type='text' value={orgSlug} onChange={e => setOrgSlug(e.target.value)}
                  placeholder='e.g. acme-corp' className={inputClass} />
              </div>
              <p className='text-xs text-gray-600 mt-1'>Ask your admin for the organization code</p>
            </div>
          )}

          {/* Full name */}
          <div>
            <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Full name</label>
            <div className={wrapClass}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input type='text' value={name} onChange={e => setName(e.target.value)}
                placeholder='John Doe' className={inputClass} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Email address</label>
            <div className={wrapClass}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input type='email' value={email} onChange={e => setEmail(e.target.value)}
                placeholder='you@example.com' className={inputClass} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Password</label>
            <div className={wrapClass}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input type='password' value={password} onChange={e => setPassword(e.target.value)}
                placeholder='Min. 6 characters' className={inputClass} />
            </div>
            {password && (
              <div className='mt-2'>
                <div className='flex gap-1'>
                  {[1,2,3,4].map(i => (
                    <div key={i} className='h-1 flex-1 rounded-full transition-all duration-300'
                      style={{ background: i <= strength ? strengthColors[strength] : '#2a2a2a' }} />
                  ))}
                </div>
                <p className='text-xs mt-1' style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Confirm password</label>
            <div className={`${wrapClass} ${confirm && password !== confirm ? '!border-red-700' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <input type='password' value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder='Repeat your password' className={inputClass} />
              {confirm && (
                <span className='shrink-0'>
                  {password === confirm
                    ? <svg className='w-4 h-4 text-emerald-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
                    : <svg className='w-4 h-4 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
                  }
                </span>
              )}
            </div>
          </div>

          <button type='submit' disabled={loading}
            className={`${mode === 'create' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} active:scale-95 text-white font-medium py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-60 mt-1`}>
            {loading
              ? (mode === 'create' ? 'Creating workspace...' : 'Sending request...')
              : (mode === 'create' ? 'Create workspace' : 'Request access')}
          </button>

          {toast && (
            <div className={`text-sm text-center px-4 py-2.5 rounded-xl border ${toast.type === 'success' ? 'bg-emerald-950 border-emerald-700 text-emerald-300' : 'bg-red-950 border-red-700 text-red-300'}`}>
              {toast.msg}
            </div>
          )}
        </form>

        {/* Google */}
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
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className='text-emerald-500 hover:text-emerald-400 transition-colors'>
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register