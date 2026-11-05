'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { quizService } from '../../services/quiz.service';
import type { QuizListItem } from '../../types/quiz';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
const handleDelete = async (id: number) => {
  const confirmed = window.confirm('Are you sure you want to delete this quiz?');

  if (!confirmed) return;

  try {
    await quizService.delete(id);
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
  } catch (error) {
    console.error(error);
    alert('Failed to delete quiz');
  }
};


  useEffect(() => {
    quizService
      .getAll()
      .then(setQuizzes)
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-8">Loading quizzes...</p>;
  }

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Quizzes</h1>

        <Link
          href="/create"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Create Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <p>No quizzes yet. Create your first quiz!</p>
      ) : (
        <ul className="space-y-3">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <Link href={`/quizzes/${quiz.id}`} className="font-medium">
                {quiz.title}
              </Link>

              <div className="flex items-center gap-4">
  <span className="text-gray-500">
    {quiz.questionsCount} questions
  </span>

  <button
    onClick={() => handleDelete(quiz.id)}
    className="rounded-lg px-3 py-1 text-red-600 hover:bg-red-50"
    aria-label={`Delete ${quiz.title}`}
    title="Delete quiz"
  >
    🗑
  </button>
</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}