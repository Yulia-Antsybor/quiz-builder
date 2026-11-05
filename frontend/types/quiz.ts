export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface Question {
  id?: number;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | string[] | boolean;
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
  createdAt?: string;
}

export interface QuizListItem {
  id: number;
  title: string;
  questionsCount: number;
}