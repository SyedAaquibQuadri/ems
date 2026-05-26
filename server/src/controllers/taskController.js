import Task from '../models/Task.js';
import User from '../models/User.js';

// @desc    Create a task (admin only)
// @route   POST /api/tasks
export const createTask = async (req, res) => {
  const { title, description, assignedTo, priority, deadline } = req.body

  try {
    const employee = await User.findById(assignedTo)
    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ message: 'Employee not found' })
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      organizationId: req.user.organizationId,
      priority,
      deadline,
    })

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all tasks (admin only)
// @route   GET /api/tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ organizationId: req.user.organizationId })
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get logged in employee's tasks
// @route   GET /api/tasks/my
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user._id,
      organizationId: req.user.organizationId,
    }).populate('assignedBy', 'name email')
      .sort({ createdAt: -1 })

    const summary = {
      total: tasks.length,
      new: tasks.filter(t => t.status === 'new').length,
      active: tasks.filter(t => t.status === 'active').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      failed: tasks.filter(t => t.status === 'failed').length,
    }

    res.json({ tasks, summary })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update task status (employee only)
// @route   PATCH /api/tasks/:id/status
export const updateTaskStatus = async (req, res) => {
  const { status } = req.body
  const allowedStatuses = ['new', 'active', 'completed', 'failed']

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' })
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user._id,
      organizationId: req.user.organizationId,
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not assigned to you' })
    }

    task.status = status

    if (status === 'active' && !task.acceptedAt) {
      task.acceptedAt = new Date()
    }

    if (status === 'completed' || status === 'failed') {
      task.completedAt = new Date()
    }

    await task.save()
    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update task details (admin only)
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  const { title, description, assignedTo, priority, deadline, status } = req.body

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    task.title       = title       || task.title
    task.description = description || task.description
    task.assignedTo  = assignedTo  || task.assignedTo
    task.priority    = priority    || task.priority
    task.deadline    = deadline    || task.deadline
    task.status      = status      || task.status

    const updated = await task.save()
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete a task (admin only)
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    await task.deleteOne()
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}