'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { quizService } from '../../services/quiz.service';
import type { Question, QuestionType } from '../../types/quiz';

export default function CreateQuizPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'BOOLEAN',
        correctAnswer: true,
      },
    ]);
  };

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | string[] | boolean | QuestionType,
  ) => {
    setQuestions((prev) =>
      prev.map((question, i) =>
        i === index ? { ...question, [field]: value } : question,
      ),
    );
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || questions.length === 0) {
      alert('Enter a quiz title and add at least one question.');
      return;
    }

    setLoading(true);

    try {
      const quiz = await quizService.create({ title, questions });
      router.push(`/quizzes/${quiz.id}`);
    } catch (error) {
      console.error(error);
      alert('Failed to create quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Create Quiz</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quiz title"
        className="mb-6 w-full rounded-lg border p-3"
      />

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="rounded-lg border p-4">
            <div className="mb-4 flex justify-between">
              <h2 className="font-semibold">Question {index + 1}</h2>

              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>

            <input
              value={question.text}
              onChange={(e) =>
                updateQuestion(index, 'text', e.target.value)
              }
              placeholder="Enter question"
              className="mb-4 w-full rounded-lg border p-3"
            />

            <select
              value={question.type}
              onChange={(e) => {
                const type = e.target.value as QuestionType;

                updateQuestion(index, 'type', type);
                updateQuestion(
                  index,
                  'correctAnswer',
                  type === 'BOOLEAN' ? true : type === 'CHECKBOX' ? [] : '',
                );
                updateQuestion(
                  index,
                  'options',
                  type === 'CHECKBOX' ? ['', ''] : [],
                );
              }}
              className="mb-4 w-full rounded-lg border p-3"
            >
              <option value="BOOLEAN">True / False</option>
              <option value="INPUT">Short text answer</option>
              <option value="CHECKBOX">Multiple choice</option>
            </select>

            {question.type === 'BOOLEAN' && (
              <select
                value={String(question.correctAnswer)}
                onChange={(e) =>
                  updateQuestion(
                    index,
                    'correctAnswer',
                    e.target.value === 'true',
                  )
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            )}

            {question.type === 'INPUT' && (
              <input
                value={String(question.correctAnswer)}
                onChange={(e) =>
                  updateQuestion(index, 'correctAnswer', e.target.value)
                }
                placeholder="Correct answer"
                className="w-full rounded-lg border p-3"
              />
            )}

            {question.type === 'CHECKBOX' && (
              <div className="space-y-2">
                {question.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex gap-2">
                    <input
                      value={option}
                      onChange={(e) => {
                        const options = [...(question.options || [])];
                        options[optionIndex] = e.target.value;
                        updateQuestion(index, 'options', options);
                      }}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="flex-1 rounded-lg border p-2"
                    />

                    <input
                      type="checkbox"
                      checked={Array.isArray(question.correctAnswer) &&
                        question.correctAnswer.includes(option)}
                      onChange={(e) => {
                        const current = Array.isArray(question.correctAnswer)
                          ? question.correctAnswer
                          : [];

                        const updated = e.target.checked
                          ? [...current, option]
                          : current.filter((answer) => answer !== option);

                        updateQuestion(index, 'correctAnswer', updated);
                      }}
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    updateQuestion(index, 'options', [
                      ...(question.options || []),
                      '',
                    ])
                  }
                  className="text-blue-600"
                >
                  + Add option
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addQuestion}
        className="mt-6 rounded-lg border px-4 py-2"
      >
        + Add question
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="ml-3 mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Save Quiz'}
      </button>
    </main>
  );
}