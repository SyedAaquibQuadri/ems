import React from 'react'

const TaskList = () => {
  return (
    <div id='tasklist' className='h-[55%] overflow-x-auto flex items-center justify-start gap-5 flex-nowrap w-full mt-10 py-5'>
        <div className='flex-shrink-0 h-full w-[300px]  rounded-xl'>
           <div className="bg-[#f07070] rounded-2xl p-5 w-72">
      <div className="flex justify-between items-center mb-5">
        <span className="bg-[#c0392b] text-white text-sm px-3 py-1 rounded-lg">High</span>
        <span className="text-white text-sm">20 feb 2024</span>
      </div>
      <h2 className="text-white font-semibold text-lg mb-2">Make a youtube video</h2>
      <p className="text-white text-sm opacity-90">Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus ullam libero quisquam. Ea, vitae et.</p>
    </div>
    </div>
    </div>
  )
}

export default TaskList