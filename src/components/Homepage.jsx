import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Homepage = () => {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='bg-[#0f0f0f] text-white min-h-screen'>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f0f0f]/90 backdrop-blur-md border-b border-[#2a2a2a]' : ''}`}>
        <div className='max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className='font-semibold text-white text-lg'>EMS</span>
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate('/login')}
              className='text-sm text-gray-400 hover:text-white transition-colors px-4 py-2'>
              Log in
            </button>
            <button
              onClick={() => navigate('/register')}
              className='text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors'>
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='min-h-screen flex items-center justify-center px-4 md:px-8 pt-20'>
        <div className='max-w-6xl mx-auto w-full'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div>
              {/* Badge */}
              <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-medium mb-6'>
                <div className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
                Open Source Project
              </div>

              <h1 className='text-4xl md:text-6xl font-bold leading-tight mb-6'>
                Manage your team
                <span className='text-emerald-400'> effortlessly</span>
              </h1>
              <p className='text-gray-400 text-lg leading-relaxed mb-8'>
                A modern employee task management system. Assign tasks, track progress, and keep your team aligned — all in one place.
              </p>
              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  onClick={() => navigate('/register')}
                  className='flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-medium transition-all active:scale-95'>
                  Get started free
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className='flex items-center justify-center gap-2 border border-[#2a2a2a] hover:border-[#4b5563] hover:bg-[#1f1f1f] text-gray-300 px-6 py-3.5 rounded-xl font-medium transition-all'>
                  Sign in
                </button>
              </div>
            </div>

            {/* Hero visual */}
            <div className='hidden md:block'>
              <div className='bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-6 space-y-3'>
                <div className='flex items-center justify-between mb-4'>
                  <span className='text-sm font-medium text-white'>Team Overview</span>
                  <span className='text-xs text-emerald-400 bg-emerald-950 px-2 py-1 rounded-full border border-emerald-800'>Live</span>
                </div>
                {['Alice Johnson', 'Bob Smith', 'Carol White'].map((name, i) => (
                  <div key={i} className='flex items-center justify-between bg-[#161616] rounded-xl px-4 py-3 border border-[#2a2a2a]'>
                    <div className='flex items-center gap-3'>
                      <div className='w-7 h-7 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center text-xs font-medium'>
                        {name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className='text-sm text-white'>{name}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      {['new', 'active', 'done'].map((s, j) => (
                        <span key={j} className={`text-xs px-2 py-0.5 rounded-full ${
                          s === 'new' ? 'bg-blue-950 text-blue-300' :
                          s === 'active' ? 'bg-amber-950 text-amber-300' :
                          'bg-emerald-950 text-emerald-300'
                        }`}>{[2,1,3][j]}</span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className='mt-4 pt-4 border-t border-[#2a2a2a] grid grid-cols-4 gap-2'>
                  {[['12', 'Total'], ['4', 'Active'], ['6', 'Done'], ['2', 'New']].map(([num, label], i) => (
                    <div key={i} className='text-center'>
                      <p className='text-lg font-semibold text-white'>{num}</p>
                      <p className='text-xs text-gray-500'>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className='py-20 px-4 md:px-8 border-t border-[#1a1a1a]'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-8'>
              <div className='w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 text-2xl font-bold mb-4'>
                SQ
              </div>
              <h3 className='text-xl font-semibold text-white mb-1'>Syed Aaquib Quadri</h3>
              <p className='text-emerald-400 text-sm mb-4'>Full Stack Developer</p>
              <p className='text-gray-400 text-sm leading-relaxed'>
                A collage student who wants to understand the software development. I created EMS as a personal project to learn and demonstrate full-stack development with the MERN stack.
              </p>
              <div className='flex items-center gap-3 mt-6'>
                <a href='https://github.com/SyedAaquibQuadri' target='_blank' rel='noreferrer'
                  className='flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors border border-[#2a2a2a] hover:border-[#4b5563] px-3 py-2 rounded-lg'>
                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z'/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
            <div>
              <p className='text-xs font-medium tracking-widest text-emerald-400 uppercase mb-3'>About this project</p>
              <h2 className='text-3xl md:text-4xl font-bold mb-6'>Why I built EMS</h2>
              <div className='space-y-4 text-gray-400 leading-relaxed'>
                <p>Managing employee tasks manually through spreadsheets or chat apps is messy and hard to track. I wanted to build a proper solution that demonstrates real-world full-stack development.</p>
                <p>EMS is built with the MERN stack — MongoDB, Express, React, and Node.js — with JWT authentication, Google OAuth, role-based access control, and a fully responsive dark UI.</p>
                <p>This project showcases everything from database design and REST API development to React state management and production deployment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-4 md:px-8 border-t border-[#1a1a1a]'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <p className='text-xs font-medium tracking-widest text-emerald-400 uppercase mb-3'>Features</p>
            <h2 className='text-3xl md:text-4xl font-bold'>Everything you need</h2>
          </div>
          <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                title: 'Role-based Access',
                desc: 'Separate views for admins and employees. Admins manage, employees execute.'
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
                title: 'Task Lifecycle',
                desc: 'Track tasks from new → active → completed or failed with real-time updates.'
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
                title: 'Secure Auth',
                desc: 'JWT authentication with httpOnly cookies and Google OAuth 2.0 support.'
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
                title: 'Team Overview',
                desc: 'Admin gets a bird\'s eye view of all employees and their task counts.'
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />,
                title: 'Mobile Responsive',
                desc: 'Fully responsive design that works beautifully on any screen size.'
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                title: 'Real-time Data',
                desc: 'All data synced with MongoDB Atlas. No stale data, no localStorage hacks.'
              },
            ].map((f, i) => (
              <div key={i} className='bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#3a3a3a] transition-all'>
                <div className='w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {f.icon}
                  </svg>
                </div>
                <h3 className='text-white font-semibold mb-2'>{f.title}</h3>
                <p className='text-gray-500 text-sm leading-relaxed'>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className='py-20 px-4 md:px-8 border-t border-[#1a1a1a]'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <p className='text-xs font-medium tracking-widest text-emerald-400 uppercase mb-3'>How it works</p>
            <h2 className='text-3xl md:text-4xl font-bold'>Simple 3-step process</h2>
          </div>
          <div className='grid md:grid-cols-3 gap-6'>
            {[
              { step: '01', title: 'Sign up', desc: 'Register your account. Admin reviews and approves your access as an employee.' },
              { step: '02', title: 'Get assigned', desc: 'Admin creates tasks and assigns them to you with priority levels and deadlines.' },
              { step: '03', title: 'Track & complete', desc: 'Accept tasks, track your progress, and mark them as completed or failed.' },
            ].map((s, i) => (
              <div key={i} className='relative'>
                {i < 2 && (
                  <div className='hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-emerald-800 to-transparent z-10 -translate-x-6' />
                )}
                <div className='bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-6 hover:border-emerald-900/50 transition-all'>
                  <span className='text-4xl font-bold text-emerald-900'>{s.step}</span>
                  <h3 className='text-white font-semibold text-lg mt-3 mb-2'>{s.title}</h3>
                  <p className='text-gray-500 text-sm leading-relaxed'>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className='py-20 px-4 md:px-8 border-t border-[#1a1a1a]'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <p className='text-xs font-medium tracking-widest text-emerald-400 uppercase mb-3'>Use Cases</p>
            <h2 className='text-3xl md:text-4xl font-bold'>Where EMS fits</h2>
          </div>
          <div className='grid sm:grid-cols-2 md:grid-cols-4 gap-4'>
            {[
              { emoji: '🏢', title: 'Small Businesses', desc: 'Manage a small team without expensive enterprise software.' },
              { emoji: '🚀', title: 'Startups', desc: 'Move fast with a lightweight task management system.' },
              { emoji: '🎓', title: 'Academic Teams', desc: 'Coordinate project work among students and supervisors.' },
              { emoji: '💻', title: 'Dev Teams', desc: 'Track development tasks across frontend and backend developers.' },
            ].map((u, i) => (
              <div key={i} className='bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#3a3a3a] transition-all text-center'>
                <div className='text-3xl mb-4'>{u.emoji}</div>
                <h3 className='text-white font-semibold mb-2'>{u.title}</h3>
                <p className='text-gray-500 text-sm leading-relaxed'>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4 md:px-8 border-t border-[#1a1a1a]'>
        <div className='max-w-2xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>Ready to get started?</h2>
          <p className='text-gray-400 mb-8'>Join EMS today and bring clarity to your team's work.</p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <button
              onClick={() => navigate('/register')}
              className='flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-medium transition-all active:scale-95'>
              Create free account
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/login')}
              className='flex items-center justify-center gap-2 border border-[#2a2a2a] hover:border-[#4b5563] hover:bg-[#1f1f1f] text-gray-300 px-8 py-3.5 rounded-xl font-medium transition-all'>
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-[#1a1a1a] py-8 px-4 md:px-8'>
        <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className='text-sm text-gray-400'>EMS — Built by <a href='https://github.com/SyedAaquibQuadri' target='_blank' rel='noreferrer' className='text-emerald-400 hover:text-emerald-300'>Syed Aaquib Quadri</a></span>
          </div>
          <div className='flex items-center gap-6 text-sm text-gray-600'>
            <a href='https://github.com/SyedAaquibQuadri/ems' target='_blank' rel='noreferrer' className='hover:text-gray-400 transition-colors'>GitHub</a>
            <span>MIT License</span>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Homepage