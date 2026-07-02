import { useState } from 'react';
import { useProgress } from './ProgressContext';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizProps {
  moduleId: string;
  questions: QuizQuestion[];
  /** Fraction of questions that must be correct to mark the module complete. */
  passThreshold?: number;
}

// Knowledge check with instant feedback. Answering a question locks it and
// reveals the explanation; passing the quiz marks the module complete.
export default function Quiz({ moduleId, questions, passThreshold = 0.7 }: QuizProps) {
  const { markComplete, isComplete } = useProgress();
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));

  const answeredCount = answers.filter((a) => a !== null).length;
  const correctCount = answers.filter((a, i) => a === questions[i].correctIndex).length;
  const allAnswered = answeredCount === questions.length;
  const passed = allAnswered && correctCount / questions.length >= passThreshold;

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    if (answers[questionIndex] !== null) return; // locked after first pick
    const next = [...answers];
    next[questionIndex] = optionIndex;
    setAnswers(next);

    const willBeComplete = next.every((a) => a !== null);
    if (willBeComplete) {
      const correct = next.filter((a, i) => a === questions[i].correctIndex).length;
      if (correct / questions.length >= passThreshold) {
        markComplete(moduleId);
      }
    }
  };

  const reset = () => setAnswers(questions.map(() => null));

  const optionStyle = (questionIndex: number, optionIndex: number): React.CSSProperties => {
    const picked = answers[questionIndex];
    const isCorrect = optionIndex === questions[questionIndex].correctIndex;
    const isPicked = picked === optionIndex;

    let border = '1px solid rgba(148, 163, 184, 0.3)';
    let background = 'rgba(30, 41, 59, 0.4)';
    let color = '#e2e8f0';

    if (picked !== null) {
      if (isCorrect) {
        border = '2px solid #22c55e';
        background = 'rgba(34, 197, 94, 0.12)';
        color = '#86efac';
      } else if (isPicked) {
        border = '2px solid #ef4444';
        background = 'rgba(239, 68, 68, 0.12)';
        color = '#fca5a5';
      } else {
        color = '#64748b';
      }
    }

    return {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      padding: '12px 16px',
      marginBottom: 8,
      borderRadius: 8,
      border,
      background,
      color,
      fontSize: '0.95rem',
      cursor: picked === null ? 'pointer' : 'default',
      transition: 'all 0.15s ease',
    };
  };

  return (
    <div
      style={{
        margin: '3rem auto 0',
        maxWidth: 800,
        padding: '2rem',
        borderRadius: 12,
        border: '2px solid rgba(148, 163, 184, 0.25)',
        background: 'rgba(15, 23, 42, 0.6)',
      }}
    >
      <h2 style={{ marginTop: 0, color: '#f8fafc' }}>
        🧠 Knowledge Check
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
        Answer {questions.length} quick questions to lock in what you just read.
        Get {Math.ceil(questions.length * passThreshold)} or more right and this module is marked complete.
      </p>

      {questions.map((q, qi) => {
        const picked = answers[qi];
        return (
          <div key={qi} style={{ marginTop: '1.75rem' }}>
            <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
              {qi + 1}. {q.question}
            </div>
            {q.options.map((option, oi) => (
              <button key={oi} style={optionStyle(qi, oi)} onClick={() => selectAnswer(qi, oi)}>
                {picked !== null && oi === q.correctIndex && '✓ '}
                {picked === oi && oi !== q.correctIndex && '✗ '}
                {option}
              </button>
            ))}
            {picked !== null && (
              <div
                style={{
                  marginTop: 8,
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#bfdbfe',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                }}
              >
                {picked === q.correctIndex ? '✅ Correct. ' : '❌ Not quite. '}
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {allAnswered && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.25rem',
            borderRadius: 10,
            textAlign: 'center',
            background: passed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: passed ? '2px solid rgba(34, 197, 94, 0.4)' : '2px solid rgba(245, 158, 11, 0.4)',
          }}
        >
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: passed ? '#22c55e' : '#f59e0b' }}>
            {correctCount} / {questions.length} correct
          </div>
          <div style={{ color: '#cbd5e1', marginTop: 6, fontSize: '0.95rem' }}>
            {passed
              ? isComplete(moduleId)
                ? '🎉 Nice work — this module is marked complete.'
                : '🎉 Nice work!'
              : 'Review the explanations above, then give it another shot.'}
          </div>
          <button
            onClick={reset}
            style={{
              marginTop: '1rem',
              background: 'transparent',
              border: '1px solid rgba(148, 163, 184, 0.4)',
              color: '#94a3b8',
              padding: '8px 18px',
              borderRadius: 6,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            ↻ Try again
          </button>
        </div>
      )}
    </div>
  );
}
