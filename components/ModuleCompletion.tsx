import { useEffect } from 'react';
import { useProgress } from './ProgressContext';
import { getModuleById, allModules } from '../data/modules';
import { quizzes } from '../data/quizzes';
import Quiz from './Quiz';

interface ModuleCompletionProps {
  moduleId: string;
}

// Completion card shown at the bottom of every module page, with the module's
// knowledge check (from data/quizzes.ts) rendered above it when one exists.
// Also records the visit so the landing page can offer "continue where you left off".
export default function ModuleCompletion({ moduleId }: ModuleCompletionProps) {
  const { isComplete, markComplete, unmarkComplete, recordVisit, completedCount, totalCount } = useProgress();

  useEffect(() => {
    recordVisit(moduleId);
  }, [moduleId, recordVisit]);

  const complete = isComplete(moduleId);
  const moduleInfo = getModuleById(moduleId);
  const position = allModules.findIndex((m) => m.id === moduleId) + 1;
  const questions = quizzes[moduleId];

  return (
    <>
      {questions && <Quiz moduleId={moduleId} questions={questions} />}
    <div
      style={{
        margin: '3rem auto 1rem',
        maxWidth: 700,
        padding: '1.5rem 2rem',
        borderRadius: 12,
        border: complete ? '2px solid rgba(34, 197, 94, 0.5)' : '2px solid rgba(148, 163, 184, 0.25)',
        background: complete ? 'rgba(34, 197, 94, 0.08)' : 'rgba(30, 41, 59, 0.5)',
        textAlign: 'center',
        transition: 'all 0.25s ease',
      }}
    >
      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
        Module {position} of {totalCount}
        {moduleInfo ? ` · ${moduleInfo.title}` : ''}
      </div>
      {complete ? (
        <>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#22c55e', marginBottom: '0.75rem' }}>
            ✓ Module completed
          </div>
          <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1rem' }}>
            {completedCount} of {totalCount} modules done. Keep going!
          </div>
          <button
            onClick={() => unmarkComplete(moduleId)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(148, 163, 184, 0.4)',
              color: '#94a3b8',
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Mark as not complete
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>
            Finished this module?
          </div>
          <button
            onClick={() => markComplete(moduleId)}
            style={{
              background: '#16a34a',
              border: 'none',
              color: 'white',
              padding: '12px 28px',
              borderRadius: 8,
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#15803d';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#16a34a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ✓ Mark as complete
          </button>
        </>
      )}
    </div>
    </>
  );
}
