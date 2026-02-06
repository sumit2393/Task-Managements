# Task Management App

A modern, full-stack task management application built with Next.js 16, Prisma ORM, and Tailwind CSS. Organize your tasks efficiently with an intuitive interface and persistent SQLite database.

## 🎯 Features

- ✅ **Create Tasks** - Add new tasks with title, description, and priority levels
- ✅ **Edit Tasks** - Update existing task details inline
- ✅ **Delete Tasks** - Remove completed or unwanted tasks
- ✅ **Toggle Completion** - Mark tasks as complete or incomplete
- ✅ **Priority Levels** - Set Low, Medium, or High priority for each task
- ✅ **Task Organization** - View pending and completed tasks in separate sections
- ✅ **Persistent Storage** - SQLite database for reliable data persistence
- ✅ **Dark Theme** - Modern dark interface with black background and white text
- ✅ **Server Actions** - Secure server-side operations for all database mutations

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Database ORM**: [Prisma](https://www.prisma.io)
- **Database**: SQLite with Better SQLite3 adapter
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **UI Framework**: [React 19](https://react.dev)
- **Bundler**: Turbopack

## 📋 Project Structure

```
.
├── app/
│   ├── action.ts          # Server actions for CRUD operations
│   ├── layout.tsx         # Root layout with dark theme setup
│   ├── page.tsx           # Home page component
│   └── globals.css        # Global styles
├── components/
│   ├── AddTaskButton.tsx  # Add task modal toggle button
│   ├── TaskForm.tsx       # Create/edit task form
│   ├── TaskItem.tsx       # Individual task card
│   └── TaskList.tsx       # Task list container
├── lib/
│   └── prisma.ts          # Prisma client singleton
├── prisma/
│   └── schema.prisma      # Database schema definition
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.ts         # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm, yarn, or pnpm package manager

### Installation

1. **Clone or extract the project:**
```bash
cd prisma-nextjs-task-management-app
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Setup environment variables:**

Create a `.env.local` file in the root directory (optional - defaults to `file:./dev.db`):
```env
DATABASE_URL="file:./dev.db"
```

4. **Initialize the database:**
```bash
npx prisma db push
```

5. **Start the development server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open in browser:**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 💾 Database Schema

The application uses a single `Task` model with the following fields:

```prisma
model Task {
  id          Int      @id @default(autoincrement())
  title       String                           // Task title (required)
  description String?                          // Task description (optional)
  completed   Boolean  @default(false)        // Completion status
  priority    String   @default("medium")     // Priority: low | medium | high
  createdAt   DateTime @default(now())        // Creation timestamp
  updatedAt   DateTime @updatedAt             // Last update timestamp
}
```

## 🔧 Server Actions

All database operations are handled through server actions in `app/action.ts`:

### `createTask(formData: FormData)`
Creates a new task in the database.
- **Parameters**: FormData with `title`, `description`, and `priority`
- **Returns**: `{ error?: string }`

### `getTasks()`
Fetches all tasks from the database.
- **Parameters**: None
- **Returns**: `Task[]` (sorted by creation date, newest first)

### `toggleTaskComplete(id: number)`
Toggles the completion status of a task.
- **Parameters**: Task ID
- **Returns**: Task update result

### `updateTask(id: number, formData: FormData)`
Updates an existing task's details.
- **Parameters**: Task ID and FormData with new values
- **Returns**: `{ error?: string }`

### `deleteTask(id: number)`
Deletes a task from the database.
- **Parameters**: Task ID
- **Returns**: Task deletion result

## 🎨 Component Guide

### `AddTaskButton`
Modal toggle button for opening the task creation form.
- **State**: `isOpen` - controls modal visibility
- **Props**: None

### `TaskForm`
Reusable form component for creating and editing tasks.
- **Props**: 
  - `task?` - Optional task object for edit mode
  - `onSuccess?` - Callback when submission succeeds
- **Features**: Validation, error handling, loading states

### `TaskItem`
Individual task card with actions.
- **Props**: `task` - Task object to display
- **Actions**: Edit, Delete, Toggle Completion
- **Features**: Inline editing, priority badges, completion indicators

### `TaskList`
Server component that fetches and displays all tasks.
- **Props**: None
- **Features**: Separates tasks into pending and completed sections

## 🌙 Dark Theme

The application uses a permanent dark theme with:
- Black background (`bg-black`)
- White text (`text-white`)
- Dark gray cards (`bg-gray-900`)
- Colored priority badges:
  - **Low**: Green background
  - **Medium**: Yellow background
  - **High**: Red background

Theme is configured in `app/layout.tsx` with the `dark` class on the HTML element.

## 📦 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Run TypeScript type checking
npm run tsc
```

## 🔐 Data Persistence

All tasks are stored in a local SQLite database at `./dev.db`. The database is created automatically on first run via Prisma migrations.

To reset the database:
```bash
rm dev.db
npx prisma db push
```

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Database issues
```bash
# Reset Prisma client
rm -rf node_modules/.prisma

# Reinitialize database
npx prisma db push --force-reset
```

### Hydration warnings
The app uses `suppressHydrationWarning` on the root HTML element to prevent mismatches between server and client rendering during theme initialization.

## 🚀 Deployment

The application can be deployed to:
- **Vercel** - Recommended for Next.js apps (native support)
- **Netlify** - Via Next.js adapters

For Vercel deployment:
```bash
npm install -g vercel
vercel
```

## 📄 License

This project is open source and available under the MIT License.

**Built with ❤️ using Next.js, Prisma, and Tailwind CSS**
