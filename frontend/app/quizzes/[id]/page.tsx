'use client';
import { Suspense } from 'react';
import QuizDetailsClient from './QuizDetailsClient';

export default function QuizDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="p-8">Loading quiz...</p>}>
      <QuizDetailsClient params={params} />
    </Suspense>
  );
}
