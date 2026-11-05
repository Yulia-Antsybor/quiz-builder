# Quiz Builder

A full-stack application for creating and managing quizzes.

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- SQLite

## Features

- Create quizzes with a title and questions.
- Support three question types:
  - BOOLEAN — True/False questions.
  - INPUT — short text answers.
  - CHECKBOX — multiple-choice questions with multiple correct answers.
- Dynamically add and remove questions.
- View a list of quizzes with question counts.
- View quiz details and correct answers.
- Delete quizzes.

## Project Structure

```text
Quiz builder/
├── frontend/
└── backend/
    ├── prisma/
    ├── index.ts
    └── package.json
```

## Getting Started

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
DATABASE_URL="file:./dev.db"
PORT=3001
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm run dev
```

Backend runs at http://localhost:3001.

### 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at http://localhost:3000.