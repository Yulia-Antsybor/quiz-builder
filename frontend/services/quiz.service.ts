import type { Quiz, QuizListItem } from '../types/quiz';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const quizService = {
  async getAll(): Promise<QuizListItem[]> {
    const response = await fetch(`${API_URL}/quizzes`);

    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }

    return response.json();
  },

  async getById(id: number): Promise<Quiz> {
    const response = await fetch(`${API_URL}/quizzes/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch quiz');
    }

    return response.json();
  },

  async create(data: Omit<Quiz, 'id'>): Promise<Quiz> {
    const response = await fetch(`${API_URL}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create quiz');
    }

    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/quizzes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete quiz');
    }
  },
};