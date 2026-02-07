"use client"
import { useState, useRef } from 'react'
import * as actions from '@/app/action'

/**
 * Props for TaskForm component
 * task - Optional existing task for editing mode
 * onSuccess - Callback when form submission succeeds
 */
type TaskFormProps = {
  task?: {
    id: number
    title: string
    description: string | null
    priority: string
  }
  onSuccess?: () => void
}

/**
 * TaskForm Component
 * Handles creation and editing of tasks
 * Renders form with title, description, and priority fields
 * Supports both create and update operations
 */
export default function TaskForm({ task, onSuccess }: TaskFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Determine if form is in edit mode (true) or create mode (false)
  const isEditing = !!task

  /**
   * Handle form submission
   * Calls appropriate server action based on mode (create or update)
   * Shows error if validation fails, calls onSuccess callback if successful
   */
  async function handleSubmit(formData: FormData) {
    // Prevent multiple submissions
    if (isSubmitting) {
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      // Call create or update action based on mode
      const result = isEditing
        ? await actions.updateTask(task.id, formData)
        : await actions.createTask(formData)

      // Handle error response
      if (result.error) {
        setError(result.error)
      } else if (onSuccess) {
        // Reset form if in create mode
        if (!isEditing && formRef.current) {
          formRef.current.reset()
        }
        // Call success callback to close modal
        onSuccess()
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Prevent button clicks when form is submitting
   */
  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (isSubmitting) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {/* Error message display */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Title input field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={task?.title || ''}
          required
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter task title"
        />
      </div>

      {/* Description textarea field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={task?.description || ''}
          rows={3}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter task description (optional)"
        />
      </div>

      {/* Priority select field */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          defaultValue={task?.priority || 'medium'}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Submit button - shows loading state during submission */}
      <button
        type="submit"
        disabled={isSubmitting}
        onClick={handleButtonClick}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  )
}