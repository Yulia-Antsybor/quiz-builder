import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// GET /quizzes — отримати всі вікторини
app.get('/quizzes', async (_req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(
      quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        questionsCount: quiz._count.questions,
      }))
    );
  } catch {
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
});

// GET /quizzes/:id — отримати вікторину з питаннями
app.get('/quizzes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: 'Invalid quiz ID' });
      return;
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found' });
      return;
    }

    res.json({
      ...quiz,
      questions: quiz.questions.map((question) => ({
        ...question,
        options: question.options ? JSON.parse(question.options) : [],
       correctAnswer: JSON.parse(question.correctAnswer),
      })),
    });
  } catch {
    res.status(500).json({ message: 'Failed to fetch quiz' });
  }
});

// POST /quizzes — створити вікторину
app.post('/quizzes', async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      res.status(400).json({ message: 'Title and questions are required' });
      return;
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: title.trim(),
        questions: {
          create: questions.map((question: any) => ({
            text: question.text,
            type: question.type,
            options: question.options
              ? JSON.stringify(question.options)
              : null,
            correctAnswer: JSON.stringify(question.correctAnswer),
          })),
        },
      },
      include: { questions: true },
    });

    res.status(201).json({
      ...quiz,
      questions: quiz.questions.map((question) => ({
        ...question,
        options: question.options ? JSON.parse(question.options) : [],
       correctAnswer: JSON.parse(question.correctAnswer),
      })),
    });
  } catch {
    res.status(500).json({ message: 'Failed to create quiz' });
  }
});

// DELETE /quizzes/:id — видалити вікторину
app.delete('/quizzes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: 'Invalid quiz ID' });
      return;
    }

    await prisma.quiz.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Quiz not found' });
      return;
    }

    res.status(500).json({ message: 'Failed to delete quiz' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});