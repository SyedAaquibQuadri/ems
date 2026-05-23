import React from 'react'
import AcceptTask from './AcceptTask'
import NewTask from './NewTask'
import CompleteTask from './CompleteTask'
import FailedTask from './FaliedTask'

const TaskList = ({ tasks, onStatusUpdate }) => {
  return (
    <div id='tasklist' className='h-[50%] overflow-x-auto flex items-center justify-start gap-5 flex-nowrap w-full py-1 mt-16'>
      {tasks.map((task) => {
        if (task.status === 'active')    return <AcceptTask    key={task._id} data={task} onStatusUpdate={onStatusUpdate} />
        if (task.status === 'new')       return <NewTask       key={task._id} data={task} onStatusUpdate={onStatusUpdate} />
        if (task.status === 'completed') return <CompleteTask  key={task._id} data={task} />
        if (task.status === 'failed')    return <FailedTask    key={task._id} data={task} />
      })}
    </div>
  )
}

export default TaskList