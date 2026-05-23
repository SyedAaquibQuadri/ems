import React, { useState } from 'react'
import api from '../../utils/api'

const CreateTask = ({ employees, onTaskCreated }) => {
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskDate, setTaskDate] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [priority, setPriority] = useState('medium')

  const inputClass = 'w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-700 outline-none focus:border-emerald-700 transition-colors'
  const labelClass = 'block text-xs font-medium text-gray-500 mb-1.5'

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!taskTitle || !taskDescription || !assignedTo) {
      alert('Please fill all required fields')
      return
    }
    try {
      await api.post('/tasks', {
        title: taskTitle,
        description: taskDescription,
        assignedTo,
        priority,
        deadline: taskDate || undefined,
      })
      setTaskTitle(''); setTaskDescription(''); setTaskDate(''); setAssignedTo(''); setPriority('medium')
      onTaskCreated() // refresh task list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task')
    }
  }

  return (
    <div className='mt-6'>
      <p className='text-xs font-medium tracking-widest text-gray-500 uppercase mb-3'>Create a task</p>
      <div className='bg-[#1c1c1c] rounded-xl border border-[#2a2a2a] p-5'>
        <form onSubmit={submitHandler} className='flex gap-6'>
          <div className='flex-1 grid grid-cols-2 gap-x-4 gap-y-4 content-start'>
            <div className='col-span-2'>
              <label className={labelClass}>Task title</label>
              <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)}
                className={inputClass} type='text' placeholder='e.g. Design new landing page' />
            </div>
            <div>
              <label className={labelClass}>Due date</label>
              <input value={taskDate} onChange={e => setTaskDate(e.target.value)}
                className={inputClass} type='date' />
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className={inputClass}>
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>
            </div>
            <div className='col-span-2'>
              <label className={labelClass}>Assign to</label>
              <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className={inputClass}>
                <option value=''>Select employee</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='w-56 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col'>
              <label className={labelClass}>Description</label>
              <textarea value={taskDescription} onChange={e => setTaskDescription(e.target.value)}
                className={`${inputClass} flex-1 resize-none min-h-[140px]`}
                placeholder='Describe the task…' />
            </div>
            <button type='submit'
              className='flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium transition-colors'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTask