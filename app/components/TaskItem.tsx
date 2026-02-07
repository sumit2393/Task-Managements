"use client";

import { deleteTask, toggleTaskComplete } from "@/app/action";
import { useState, useTransition } from "react";
import TaskForm from "./TaskForm";

/**
 * Task data type matching database schema
 */
type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Props for TaskItem component
 */
type TaskItemProps = {
  task: Task;
};

/**
 * Color mapping for priority badges
 * Used to visually distinguish between low, medium, and high priority tasks
 */
const priorityColors = {
  low: "bg-green-900 text-green-200",
  medium: "bg-yellow-900 text-yellow-200",
  high: "bg-red-900 text-red-200",
};

/**
 * TaskItem Component
 * Displays individual task information and actions
 * Supports:
 * - Toggling completion status with optimistic UI updates
 * - Editing task details
 * - Deleting tasks
 * - Visual feedback for completed tasks
 */
export default function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Optimistic state for immediate UI feedback
  const [optimisticCompleted, setOptimisticCompleted] = useState(task.completed);

  /**
   * Toggle task completion status
   * Uses optimistic UI update for instant feedback
   * Calls server action to update database
   */
  async function handleToggle() {
    if (isPending) return; // Prevent multiple clicks
    
    // Immediately update UI (optimistic update)
    setOptimisticCompleted(!optimisticCompleted);
    
    // Then update server in the background
    startTransition(async () => {
      try {
        await toggleTaskComplete(task.id);
      } catch (error) {
        // Revert optimistic update on error
        setOptimisticCompleted(optimisticCompleted);
        console.error("Failed to toggle task:", error);
      }
    });
  }

  /**
   * Delete task after confirmation
   * Shows confirmation dialog before deletion
   */
  async function handleDelete() {
    if (confirm("Are you sure you want to delete this task?")) {
      setIsDeleting(true);
      await deleteTask(task.id);
    }
  }

  // Render edit form when in edit mode
  if (isEditing) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Edit Task</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
        <TaskForm task={task} onSuccess={() => setIsEditing(false)} />
      </div>
    );
  }

  // Render task display card
  return (
    <div
      className={`bg-gray-900 p-4 rounded-lg shadow-md border transition-all ${
        optimisticCompleted 
          ? "opacity-60 border-green-700" 
          : "border-gray-700"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Custom Checkbox Button to toggle completion status */}
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`flex-shrink-0 w-6 h-6 rounded border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative flex items-center justify-center ${
            optimisticCompleted
              ? "bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700"
              : "bg-gray-700 border-gray-500 hover:border-green-500"
          }`}
          aria-label={optimisticCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {/* Loading spinner when pending - shows during transition */}
          {isPending ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            /* Checkmark icon when completed and not loading */
            optimisticCompleted && (
              <svg
                className="w-full h-full text-white p-0.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )
          )}
        </button>

        {/* Task information section */}
        <div className="flex-1">
          {/* Title and priority badge */}
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-medium transition-all ${
                optimisticCompleted ? "line-through text-gray-400" : "text-white"
              }`}
            >
              {task.title}
            </h3>
            {/* Priority badge with color mapping */}
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                priorityColors[task.priority as keyof typeof priorityColors]
              }`}
            >
              {task.priority}
            </span>
          </div>

          {/* Description (only shown if exists) */}
          {task.description && (
            <p className={`text-sm mb-2 transition-all ${
              optimisticCompleted ? "text-gray-500" : "text-gray-400"
            }`}>
              {task.description}
            </p>
          )}

          {/* Creation date */}
          <p className="text-xs text-gray-500">
            Created: {new Date(task.createdAt).toISOString().split("T")[0]}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {/* Edit button */}
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            Edit
          </button>
          {/* Delete button with loading state */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-400 hover:text-red-300 text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}