'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache'

/**
 * Task form data type
 * Defines the structure of task information submitted from the form
 */
export type TaskFormData = {
  title: string
  description?: string
  priority: string
}

/**
 * Create a new task in the database
 * @param formData - FormData object containing title, description, and priority
 * @returns Object with either success: true or error message
 */
export async function createTask(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string

  // Validate that title is not empty
  if (!title || title.trim() === '') {
    return { error: 'Title is required' }
  }

  try {
    // Insert new task into database
    await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || 'medium',
      },
    })

    // Revalidate the home page to show new task
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to create task:', error)
    return { error: 'Failed to create task' }
  }
}

/**
 * Fetch all tasks from the database, ordered by most recent first
 * @returns Array of tasks or empty array if error occurs
 */
export async function getTasks() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return tasks
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return []
  }
}

/**
 * Toggle the completion status of a task
 * @param id - Task ID to toggle
 * @returns Object with either success: true or error message
 */
export async function toggleTaskComplete(id: number) {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      return { error: 'Task not found' }
    }

    // Toggle the completed status
    await prisma.task.update({
      where: { id },
      data: {
        completed: !task.completed,
      },
    })

    // Revalidate to show updated task status
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle task:', error)
    return { error: 'Failed to toggle task' }
  }
}

/**
 * Update an existing task
 * @param id - Task ID to update
 * @param formData - FormData object containing updated title, description, and priority
 * @returns Object with either success: true or error message
 */
export async function updateTask(id: number, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string

  // Validate that title is not empty
  if (!title || title.trim() === '') {
    return { error: 'Title is required' }
  }

  try {
    // Update task in database
    await prisma.task.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || 'medium',
      },
    })

    // Revalidate to show updated task
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to update task:', error)
    return { error: 'Failed to update task' }
  }
}

/**
 * Delete a task from the database
 * @param id - Task ID to delete
 * @returns Object with either success: true or error message
 */
export async function deleteTask(id: number) {
  try {
    // Delete task from database
    await prisma.task.delete({
      where: { id },
    })

    // Revalidate to remove deleted task from display
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete task:', error)
    return { error: 'Failed to delete task' }
  }
}