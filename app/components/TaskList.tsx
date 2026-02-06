import { getTasks } from '@/app/action'
import TaskItem from './TaskItem'

/**
 * Task interface matching database schema
 */
interface Task {
  id: number
  completed: boolean
  title: string
  description: string | null
  priority: string
  createdAt: Date
  updatedAt: Date
}

/**
 * TaskList Component
 * Server component that fetches and displays all tasks
 * Separates tasks into pending and completed sections
 */
export default async function TaskList() {
  // Fetch all tasks from database via server action
  const tasks: Task[] = await getTasks()

  // Show empty state if no tasks exist
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No tasks yet. Add your first task above!</p>
      </div>
    )
  }

  // Separate tasks into completed and pending
  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)

  return (
    <div className="space-y-6">
      {/* Pending Tasks Section */}
      {pendingTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-300 mb-3">
            Pending Tasks ({pendingTasks.length})
          </h2>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-300 mb-3">
            Completed Tasks ({completedTasks.length})
          </h2>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}