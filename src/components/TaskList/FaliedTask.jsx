import React from 'react'
import TaskTimer from './TaskTimer'

const FailedTask = ({ data }) => {
  return (
    <div className='flex-shrink-0 w-[280px] md:w-[300px] bg-[#1c1c1c] border border-red-900/40 rounded-2xl p-5 flex flex-col gap-4 opacity-80'>
      <div className='flex items-center justify-between'>
        <span className='text-xs font-medium px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-900'>
          Failed
        </span>
        <span className='text-xs text-gray-600'>
          {data.deadline ? new Date(data.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No deadline'}
        </span>
      </div>

      <div className='w-full h-[2px] rounded-full bg-red-800' />

      <div className='flex-1'>
        <h2 className='text-gray-500 font-semibold text-base leading-snug mb-2'>{data.title}</h2>
        <p className='text-gray-600 text-sm leading-relaxed line-clamp-3'>{data.description}</p>
      </div>

      {/* Total time taken */}
      <div className='flex items-center justify-between pt-2 border-t border-[#2a2a2a]'>
        <TaskTimer acceptedAt={data.acceptedAt} completedAt={data.completedAt} stopped={true} />
        <div className='flex items-center gap-1.5 text-xs text-red-500'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Failed
        </div>
      </div>
    </div>
  )
}

export default FailedTask