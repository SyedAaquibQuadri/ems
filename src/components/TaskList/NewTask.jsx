import React from 'react'

const NewTask = ({ data, onStatusUpdate }) => {
  return (
    <div className='flex-shrink-0 w-[280px] md:w-[300px] bg-[#1c1c1c] border border-amber-900/40 rounded-2xl p-5 flex flex-col gap-4 hover:border-amber-800/60 transition-all'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <span className='text-xs font-medium px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800'>
          New
        </span>
        <span className='text-xs text-gray-600'>
          {data.deadline ? new Date(data.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No deadline'}
        </span>
      </div>

      {/* Priority bar */}
      <div className='w-full h-[2px] rounded-full bg-[#2a2a2a]'>
        <div className={`h-full rounded-full ${data.priority === 'high' ? 'w-full bg-red-500' : data.priority === 'medium' ? 'w-2/3 bg-yellow-500' : 'w-1/3 bg-emerald-500'}`} />
      </div>

      {/* Content */}
      <div className='flex-1'>
        <h2 className='text-white font-semibold text-base leading-snug mb-2'>{data.title}</h2>
        <p className='text-gray-500 text-sm leading-relaxed line-clamp-3'>{data.description}</p>
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between pt-2 border-t border-[#2a2a2a]'>
        <span className={`text-xs font-medium ${data.priority === 'high' ? 'text-red-400' : data.priority === 'medium' ? 'text-yellow-400' : 'text-emerald-400'}`}>
          {data.priority?.charAt(0).toUpperCase() + data.priority?.slice(1)} priority
        </span>
        <button
          onClick={() => onStatusUpdate(data._id, 'active')}
          className='flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-900 text-emerald-300 hover:bg-emerald-800 border border-emerald-800 transition-colors'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Accept
        </button>
      </div>
    </div>
  )
}

export default NewTask