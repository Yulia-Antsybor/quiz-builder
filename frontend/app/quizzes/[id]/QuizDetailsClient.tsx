'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

import { quizService } from '../../../services/quiz.service';
import type { Quiz } from '../../../types/quiz';

export default function QuizDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = use(params);
  const id = Number(rawId);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!Number.isInteger(id) || id <= 0) {
      setError('Invalid quiz ID');
      setLoading(false);
      return;
    }

    quizService
      .getById(id)
      .then(setQuiz)
      .catch(() => setError('Failed to load quiz'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <main className="p-8">Loading...</main>;
  }

  if (error || !quiz) {
    return (
      <main className="p-8">
        <p>{error || 'Quiz not found'}</p>
        <Link href="/quizzes" className="text-blue-600">
          Back to quizzes
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Link href="/quizzes" className="mb-6 inline-block text-blue-600">
        ← Back to quizzes
      </Link>

      <h1 className="mb-2 text-3xl font-bold">{quiz.title}</h1>
      <p className="mb-6 text-gray-500">
        {quiz.questions.length} questions
      </p>

      <div className="space-y-4">
        {quiz.questions.map((question, index) => (
          <div key={question.id ?? index} className="rounded-lg border p-5">
            <h2 className="mb-3 font-semibold">
              {index + 1}. {question.text}
            </h2>

            <p className="mb-2 text-sm text-gray-500">
              Type: {question.type}
            </p>

            {question.type === 'BOOLEAN' && (
              <p>
                Correct answer: {question.correctAnswer ? 'True' : 'False'}
              </p>
            )}

            {question.type === 'INPUT' && (
              <p>Correct answer: {String(question.correctAnswer)}</p>
            )}

            {question.type === 'CHECKBOX' && (
              <div>
                <p className="mb-2">Options:</p>
                <ul className="list-disc pl-6">
                  {question.options?.map((option, optionIndex) => (
                    <li key={optionIndex}>
                      {option}
                      {Array.isArray(question.correctAnswer) &&
                        question.correctAnswer.includes(option) && (
                          <span className="ml-2 text-green-600">
                            (Correct)
                          </span>
                        )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}