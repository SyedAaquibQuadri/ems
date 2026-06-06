import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'

const PendingApproval = () => {
  const { logout } = useContext(AuthContext)

  return (
    <div className='flex min-h-screen w-screen items-center justify-center bg-[#0f0f0f] px-4'>
      <div className='bg-[#181818] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-sm text-center'>
        <div className='w-12 h-12 rounded-xl bg-yellow-950 border border-yellow-800 flex items-center justify-center mx-auto mb-5'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className='text-white text-xl font-medium mb-2'>Awaiting approval</h1>
        <p className='text-gray-500 text-sm mb-6 leading-relaxed'>
          Your request has been sent to your organization's admin.
          You'll be able to log in once they approve your account.
        </p>
        <button
          onClick={logout}
          className='w-full border border-[#2a2a2a] hover:border-[#4b5563] text-gray-400 py-3 rounded-xl text-sm transition-all'>
          Back to login
        </button>
      </div>
    </div>
  )
}

export default PendingApproval