import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const Register = ({ onSwitchToLogin }) => {
  const { login } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
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

    setLoading(true)
    setToast(null)

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      // Auto login after register
      await login(email, password)
    } catch (err) {
      setToast({ type: 'error', msg: err.message || 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center bg-[#0f0f0f]'>
      <div className='bg-[#181818] border border-[#2a2a2a] rounded-2xl p-10 w-full max-w-sm'>

        {/* Icon */}
        <div className='w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center mx-auto mb-5'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>

        <h1 className='text-white text-center text-2xl font-medium mb-1'>Create account</h1>
        <p className='text-gray-500 text-center text-sm mb-8'>Sign up to get started with EMS</p>

        <form onSubmit={submitHandler} className='flex flex-col gap-4'>

          {/* Name */}
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
                <p className='text-xs mt-1' style={{ color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
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
            className='bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-60 mt-1'>
            {loading ? 'Creating account...' : 'Create account'}
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

        <p className='text-center text-gray-600 text-sm'>
          Already have an account?{' '}
          <button onClick={onSwitchToLogin}
            className='text-emerald-500 hover:text-emerald-400 transition-colors'>
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register