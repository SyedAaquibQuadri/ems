import React from 'react'
import AcceptTask from './AcceptTask'
import NewTask from './NewTask'
import CompleteTask from './CompleteTask'
import FailedTask from './FaliedTask'

const TaskList = ({ tasks, onStatusUpdate }) => {
  return (
    <div id='tasklist' className='overflow-x-auto flex items-stretch justify-start gap-4 flex-nowrap w-full py-2 mt-6 pb-4'>
      {tasks.length === 0 && (
        <div className='flex items-center justify-center w-full h-40'>
          <p className='text-gray-600 text-sm'>No tasks assigned yet</p>
        </div>
      )}
      {tasks.map((task) => {
        if (task.status === 'active')    return <AcceptTask   key={task._id} data={task} onStatusUpdate={onStatusUpdate} />
        if (task.status === 'new')       return <NewTask      key={task._id} data={task} onStatusUpdate={onStatusUpdate} />
        if (task.status === 'completed') return <CompleteTask key={task._id} data={task} />
        if (task.status === 'failed')    return <FailedTask   key={task._id} data={task} />
      })}
    </div>
  )
}

export default TaskList