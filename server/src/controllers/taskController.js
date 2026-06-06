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

    // Filter out tasks whose assigned employee was deleted
    const safeTasks = tasks.filter(t => t.assignedTo !== null)  // ← add this line

    res.json(safeTasks)  // ← return safeTasks instead of tasks
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


// @desc    Get task time analytics for org (admin only)
// @route   GET /api/tasks/analytics
export const getTaskAnalytics = async (req, res) => {
  try {
    const tasks = await Task.find({
      organizationId: req.user.organizationId,
      status: { $in: ['completed', 'failed'] },
      acceptedAt: { $ne: null },
    })
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ completedAt: -1 })

    // Group by employee
    const employeeMap = {}
    tasks.forEach(task => {
      const emp = task.assignedTo
      if (!emp) return
      if (!employeeMap[emp._id]) {
        employeeMap[emp._id] = {
          employee: { _id: emp._id, name: emp.name, email: emp.email },
          totalTasks: 0,
          completedTasks: 0,
          failedTasks: 0,
          totalTimeMs: 0,
          avgTimeMs: 0,
          tasks: [],
        }
      }
      const timeMs = task.completedAt && task.acceptedAt
        ? new Date(task.completedAt) - new Date(task.acceptedAt)
        : 0

      employeeMap[emp._id].totalTasks++
      if (task.status === 'completed') employeeMap[emp._id].completedTasks++
      if (task.status === 'failed') employeeMap[emp._id].failedTasks++
      employeeMap[emp._id].totalTimeMs += timeMs
      employeeMap[emp._id].tasks.push({
        _id: task._id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        acceptedAt: task.acceptedAt,
        completedAt: task.completedAt,
        timeMs,
      })
    })

    // Calculate averages
    const analytics = Object.values(employeeMap).map(emp => ({
      ...emp,
      avgTimeMs: emp.totalTasks > 0 ? Math.round(emp.totalTimeMs / emp.totalTasks) : 0,
    }))

    res.json(analytics)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}