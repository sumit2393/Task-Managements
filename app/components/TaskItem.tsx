"use client";

import { deleteTask, toggleTaskComplete } from "@/app/action";
import { useState } from "react";
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
 * - Toggling completion status
 * - Editing task details
 * - Deleting tasks
 * - Visual feedback for completed tasks
 */
export default function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Toggle task completion status
   * Calls server action to update database
   */
  async function handleToggle() {
    await toggleTaskComplete(task.id);
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
      className={`bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700 transition-opacity ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox to toggle completion status */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="mt-1 h-5 w-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer bg-gray-800"
        />

        {/* Task information section */}
        <div className="flex-1">
          {/* Title and priority badge */}
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-medium ${
                task.completed ? "line-through text-gray-400" : "text-white"
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
            <p className="text-gray-400 text-sm mb-2">{task.description}</p>
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