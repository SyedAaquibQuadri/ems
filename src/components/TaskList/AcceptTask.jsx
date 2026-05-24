import React from 'react'

const AcceptTask = ({ data, onStatusUpdate }) => {
  const priorityConfig = {
    high:   { bar: 'w-full bg-red-500',     text: 'text-red-400',     label: 'High' },
    medium: { bar: 'w-2/3 bg-yellow-500',   text: 'text-yellow-400',  label: 'Medium' },
    low:    { bar: 'w-1/3 bg-emerald-500',  text: 'text-emerald-400', label: 'Low' },
  }
  const p = priorityConfig[data.priority] || priorityConfig.medium

  return (
    <div className='flex-shrink-0 w-[280px] md:w-[300px] bg-[#1c1c1c] border border-amber-900/40 rounded-2xl p-5 flex flex-col gap-4 hover:border-amber-800/60 transition-all'>

      {/* Header */}
      <div className='flex items-center justify-between'>
        <span className='text-xs font-medium px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800'>
          In Progress
        </span>
        <span className='text-xs text-gray-600'>
          {data.deadline
            ? new Date(data.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : 'No deadline'}
        </span>
      </div>

      {/* Priority bar */}
      <div className='w-full h-[2px] rounded-full bg-[#2a2a2a]'>
        <div className={`h-full rounded-full transition-all ${p.bar}`} />
      </div>

      {/* Content */}
      <div className='flex-1'>
        <h2 className='text-white font-semibold text-base leading-snug mb-2'>{data.title}</h2>
        <p className='text-gray-500 text-sm leading-relaxed line-clamp-3'>{data.description}</p>
      </div>

      {/* Assigned by */}
      {data.assignedBy && (
        <div className='flex items-center gap-2'>
          <div className='w-5 h-5 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center text-[10px] text-gray-400 font-medium'>
            {data.assignedBy.name?.slice(0, 1).toUpperCase()}
          </div>
          <span className='text-xs text-gray-600'>by {data.assignedBy.name}</span>
          <span className={`ml-auto text-xs font-medium ${p.text}`}>{p.label} priority</span>
        </div>
      )}

      {/* Actions */}
      <div className='flex items-center gap-2 pt-3 border-t border-[#2a2a2a]'>
        <button
          onClick={() => onStatusUpdate(data._id, 'completed')}
          className='flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-emerald-900 text-emerald-300 hover:bg-emerald-800 border border-emerald-800 transition-colors'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Complete
        </button>
        <button
          onClick={() => onStatusUpdate(data._id, 'failed')}
          className='flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-red-950 text-red-400 hover:bg-red-900 border border-red-900 transition-colors'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Failed
        </button>
      </div>
    </div>
  )
}

export default AcceptTask