import { render, screen } from '@testing-library/react'
import TaskListNumbers from '../components/other/TaskListNumbers'

describe('TaskListNumbers Component', () => {

  it('renders loading state when no summary', () => {
    render(<TaskListNumbers summary={null} />)
    expect(screen.getByText('Loading task data...')).toBeInTheDocument()
  })

 it('renders correct task counts', () => {
  const summary = { newTask: 3, active: 2, completed: 5, failed: 1 }
  render(<TaskListNumbers summary={summary} />)

  expect(screen.getByText('3')).toBeInTheDocument()
  expect(screen.getByText('2')).toBeInTheDocument()
  expect(screen.getByText('5')).toBeInTheDocument()
  expect(screen.getByText('1')).toBeInTheDocument()
})

it('renders zero counts correctly', () => {
  const summary = { newTask: 0, active: 0, completed: 0, failed: 0 }
  render(<TaskListNumbers summary={summary} />)
  const zeros = screen.getAllByText('0')
  expect(zeros).toHaveLength(4)
})

  it('renders all four card labels', () => {
    const summary = { new: 0, active: 0, completed: 0, failed: 0 }
    render(<TaskListNumbers summary={summary} />)

    expect(screen.getByText('New tasks')).toBeInTheDocument()
    expect(screen.getByText('Active tasks')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Failed')).toBeInTheDocument()
  })

  it('renders zero counts correctly', () => {
    const summary = { new: 0, active: 0, completed: 0, failed: 0 }
    render(<TaskListNumbers summary={summary} />)
    const zeros = screen.getAllByText('0')
    expect(zeros).toHaveLength(4)
  })
})