import React from 'react'

const cards = [
  {
    key: 'newTask',
    label: 'New tasks',
    colorBar: 'bg-blue-500',
    iconBg: 'bg-blue-950',
    iconColor: 'text-blue-400',
    numColor: 'text-blue-300',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    key: 'active',
    label: 'Active tasks',
    colorBar: 'bg-amber-500',
    iconBg: 'bg-amber-950',
    iconColor: 'text-amber-400',
    numColor: 'text-amber-300',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'completed',
    label: 'Completed',
    colorBar: 'bg-emerald-500',
    iconBg: 'bg-emerald-950',
    iconColor: 'text-emerald-400',
    numColor: 'text-emerald-300',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'failed',
    label: 'Failed',
    colorBar: 'bg-red-500',
    iconBg: 'bg-red-950',
    iconColor: 'text-red-400',
    numColor: 'text-red-300',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const TaskListNumbers = ({ summary }) => {
  if (!summary) return <div className='text-gray-500 text-sm mt-8'>Loading task data...</div>

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-6'>
      {cards.map(({ key, label, colorBar, iconBg, iconColor, numColor, icon }) => (
        <div key={key} className='relative bg-[#1c1c1c] rounded-xl border border-[#2a2a2a] p-5 overflow-hidden'>
          <div className={`absolute top-0 left-0 right-0 h-[3px] ${colorBar} rounded-t-xl`} />
          <div className={`w-9 h-9 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center mb-4`}>
            {icon}
          </div>
          <p className={`text-3xl font-semibold ${numColor}`}>{summary[key] ?? 0}</p>
          <p className='text-sm text-gray-500 mt-1'>{label}</p>
        </div>
      ))}
    </div>
  )
}

export default TaskListNumbers