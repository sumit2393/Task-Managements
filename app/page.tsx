import { Suspense } from 'react'
import AddTaskButton from '@/app/components/AddTaskButton'
import TaskList from '@/app/components/TaskList'

/**
 * Home Page Component
 * Main page for the Task Management Application
 * Displays:
 * - Application header with title and description
 * - Button to add new tasks
 * - List of all tasks (pending and completed)
 * Uses Suspense boundary for streaming TaskList with loading state
 */
export default function Home() {
  return (
    // Main container with full height, black background, and vertical padding
    <main className="min-h-screen bg-black py-8">
      {/* Centered content container with max width and padding */}
      <div className="max-w-2xl mx-auto px-4">
        {/* Application header section */}
        <header className="text-center mb-8">
          {/* Main heading - large, bold, white text */}
          <h1 className="text-3xl font-bold text-white mb-2">Task Management</h1>
          {/* Subtitle - gray text with smaller font */}
          <p className="text-gray-400">Organize your tasks efficiently with Prisma & Next.js</p>
        </header>

        {/* Main content area with vertical spacing between sections */}
        <div className="space-y-6">
          {/* Button to add new tasks */}
          <AddTaskButton />

          {/* 
            Suspense boundary for TaskList
            Provides loading state while server component fetches tasks
          */}
          <Suspense
            fallback={
              // Loading indicator shown while tasks are being fetched
              <div className="text-center py-12">
                {/* Spinning animation */}
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                {/* Loading text */}
                <p className="text-gray-400 mt-2">Loading tasks...</p>
              </div>
            }
          >
            {/* Server component that fetches and displays all tasks */}
            <TaskList />
          </Suspense>
        </div>
      </div>
    </main>
  )
}