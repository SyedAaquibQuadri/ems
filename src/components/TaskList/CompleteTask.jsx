import React from 'react'
import TaskTimer from './TaskTimer'

const CompleteTask = ({ data }) => {
  return (
    <div className='flex-shrink-0 w-[280px] md:w-[300px] bg-[#1c1c1c] border border-emerald-900/40 rounded-2xl p-5 flex flex-col gap-4 opacity-80'>
      <div className='flex items-center justify-between'>
        <span className='text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800'>
          Completed
        </span>
        <span className='text-xs text-gray-600'>
          {data.deadline ? new Date(data.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No deadline'}
        </span>
      </div>

      <div className='w-full h-[2px] rounded-full bg-emerald-500' />

      <div className='flex-1'>
        <h2 className='text-gray-400 font-semibold text-base leading-snug mb-2 line-through decoration-gray-600'>{data.title}</h2>
        <p className='text-gray-600 text-sm leading-relaxed line-clamp-3'>{data.description}</p>
      </div>

      {/* Total time taken */}
      <div className='flex items-center justify-between pt-2 border-t border-[#2a2a2a]'>
        <TaskTimer acceptedAt={data.acceptedAt} completedAt={data.completedAt} stopped={true} />
        <div className='flex items-center gap-1.5 text-xs text-emerald-500'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Done
        </div>
      </div>
    </div>
  )
}

export default CompleteTask