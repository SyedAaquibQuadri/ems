import { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext)

  const logOutUser = async () => {
    await logout()
  }

  const name = currentUser?.name || 'Admin'
  const initials = name.slice(0, 2).toUpperCase()

  return (
    // ... rest of JSX stays exactly the same, just remove props.data and props.changeUser
    <div className='flex items-center justify-between py-5 px-1'>
      <div className='flex items-center gap-3.5'>
        <div className='w-11 h-11 rounded-full bg-[#1a3a2a] border border-[#0F6E56] flex items-center justify-center text-emerald-400 text-sm font-medium flex-shrink-0'>
          {initials}
        </div>
        <div>
          <p className='text-xs text-gray-500'>Good morning</p>
          <h2 className='text-lg font-medium text-white'>{name} 👋</h2>
        </div>
      </div>
      <button
        onClick={logOutUser}
        className='flex items-center gap-2 px-4 py-2 rounded-lg border border-red-800 text-red-500 text-sm hover:bg-red-950 transition-colors'
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
        </svg>
        Log out
      </button>
    </div>
  )
}

export default Header