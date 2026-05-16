import React, { useState } from 'react'

const Login = () => {
    




  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
  const strength = getStrength(password)

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setToast({ type: 'error', msg: 'Please fill in all fields.' })
      return
    }
    setLoading(true)
    setToast(null)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setToast({ type: 'success', msg: 'Logged in successfully!' })
    console.log('Form submitted', { email, password })
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center bg-[#0f0f0f]'>
      <div className='bg-[#181818] border border-[#2a2a2a] rounded-2xl p-10 w-full max-w-sm'>

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
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='you@example.com'
                className='bg-transparent outline-none text-white text-sm py-3.5 w-full placeholder:text-gray-700'
              />
            </div>
          </div>

          <div>
            <label className='text-gray-500 text-xs mb-1.5 block tracking-wide'>Password</label>
            <div className='flex items-center gap-2 bg-[#111] border border-[#2a2a2a] rounded-xl px-3 focus-within:border-emerald-600 transition-colors'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Enter your password'
                className='bg-transparent outline-none text-white text-sm py-3.5 w-full placeholder:text-gray-700'
              />
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
            <a href='#' className='text-emerald-500 text-sm hover:text-emerald-400 transition-colors'>Forgot password?</a>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-60'
          >
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

        <button className='w-full border border-[#2a2a2a] hover:border-[#4b5563] hover:bg-[#1f1f1f] text-gray-300 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer'>
          Continue with Google
        </button>

        <p className='text-center text-gray-600 text-sm mt-5'>
          Don't have an account? <a href='#' className='text-emerald-500 hover:text-emerald-400 transition-colors'>Sign up</a>
        </p>
      </div>
    </div>
  )
}

export default Login