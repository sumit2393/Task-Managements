'use client'

import { useState } from 'react'
import TaskForm from './TaskForm'

/**
 * AddTaskButton Component
 * Toggles between button state and task form modal
 * Manages open/close state for adding new tasks
 */
export default function AddTaskButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      {!isOpen ? (
        // Closed state: Show button to open form
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transition-colors font-medium"
        >
          + Add New Task
        </button>
      ) : (
        // Open state: Show form modal
        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Add New Task</h2>
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-300 text-2xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
          {/* Form component with success callback to close modal */}
          <TaskForm onSuccess={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  )
}