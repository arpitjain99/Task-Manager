# TeamFlow

TeamFlow is a full-stack team task manager where users can create projects, add team members, assign tasks, and track progress with Admin/Member role-based access.

## Features

- Clerk signup and login
- Protected dashboard and project pages
- Create projects with deadline and description
- Add members by email
- Admin/Member role-based access control
- Admin can change member roles during a project
- Admin can remove members
- Create and assign tasks to project members
- Members only see tasks assigned to them
- Members can update their own task status
- Admin can update task priority
- Dashboard stats for total, in-progress, completed, and overdue tasks
- Project status filter: All, Ongoing, Completed
- Mark project completed only after all tasks are done
- Completed projects lock task/member changes until reopened

## Tech Stack

- Next.js 14 App Router
- JavaScript and JSX
- Clerk authentication
- Prisma ORM
- PostgreSQL / Neon DB
- Tailwind CSS
- Railway deployment

## Environment Variables

Create `.env` in the project root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

Optional for production Clerk webhooks:

```env
CLERK_WEBHOOK_SECRET=whsec_...
```

## Local Setup

Install dependencies:

```bash
npm install
```

Push the Prisma schema to the database:

```bash
npx prisma db push
```

Generate Prisma Client:

```bash
npx prisma generate
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Deployment

Deploy on Railway:

1. Push the repository to GitHub.
2. Create a Railway project from the GitHub repo.
3. Add all required environment variables.
4. Use this build command:

```bash
npm run build
```

5. Use this start command:

```bash
npx prisma db push && npm start
```

## Demo Checklist

- Signup/Login
- Create a project
- Add members
- Assign tasks
- Update task status as Member
- Change task priority as Admin
- Mark project complete after all tasks are done
- Show dashboard stats and project filters
