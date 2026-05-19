import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const bgColors = ['bg-[#1a3a2a]', 'bg-[#1a2a3a]', 'bg-[#2a1a3a]', 'bg-[#3a1a2a]']
const textColors = ['text-emerald-400', 'text-blue-400', 'text-purple-400', 'text-pink-400']
const borderColors = ['border-emerald-800', 'border-blue-800', 'border-purple-800', 'border-pink-800']

const AllTask = () => {
  const [userData] = useContext(AuthContext)

  return (
    <div className='mt-6'>
      <p className='text-xs font-medium tracking-widest text-gray-500 uppercase mb-3'>Team overview</p>
      <div className='bg-[#1c1c1c] rounded-xl border border-[#2a2a2a] overflow-hidden'>

        {/* Header row */}
        <div className='flex items-center px-5 py-3 bg-[#161616] border-b border-[#2a2a2a]'>
          <span className='flex-[2] text-xs font-medium tracking-widest text-gray-500 uppercase'>Employee</span>
          <span className='flex-1 text-center text-xs font-medium tracking-widest text-gray-500 uppercase'>New</span>
          <span className='flex-1 text-center text-xs font-medium tracking-widest text-gray-500 uppercase'>Active</span>
          <span className='flex-1 text-center text-xs font-medium tracking-widest text-gray-500 uppercase'>Completed</span>
          <span className='flex-1 text-center text-xs font-medium tracking-widest text-gray-500 uppercase'>Failed</span>
        </div>

        {/* Rows */}
        {userData.map((emp, idx) => (
          <div
            key={idx}
            className='flex items-center px-5 py-3.5 border-b border-[#222] last:border-0 hover:bg-[#222] transition-colors'
          >
            <div className='flex-[2] flex items-center gap-3'>
              <div className={`w-8 h-8 rounded-full ${bgColors[idx % 4]} border ${borderColors[idx % 4]} ${textColors[idx % 4]} flex items-center justify-center text-xs font-medium flex-shrink-0`}>
                {emp.firstName.slice(0, 2).toUpperCase()}
              </div>
              <span className='text-sm font-medium text-white'>{emp.firstName}</span>
            </div>
            <div className='flex-1 flex justify-center'>
              <span className='text-xs font-medium px-3 py-1 rounded-full bg-blue-950 text-blue-300 min-w-[36px] text-center'>
                {emp.taskCounts.newTask}
              </span>
            </div>
            <div className='flex-1 flex justify-center'>
              <span className='text-xs font-medium px-3 py-1 rounded-full bg-amber-950 text-amber-300 min-w-[36px] text-center'>
                {emp.taskCounts.active}
              </span>
            </div>
            <div className='flex-1 flex justify-center'>
              <span className='text-xs font-medium px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 min-w-[36px] text-center'>
                {emp.taskCounts.completed}
              </span>
            </div>
            <div className='flex-1 flex justify-center'>
              <span className='text-xs font-medium px-3 py-1 rounded-full bg-red-950 text-red-400 min-w-[36px] text-center'>
                {emp.taskCounts.failed}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllTask