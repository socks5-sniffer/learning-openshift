import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { allModules, moduleCount } from '../data/modules';

const STORAGE_KEY = 'kubelearn-progress';
const LAST_VISITED_KEY = 'kubelearn-last-visited';

interface ProgressContextType {
  completed: string[];
  completedCount: number;
  totalCount: number;
  isComplete: (moduleId: string) => boolean;
  markComplete: (moduleId: string) => void;
  unmarkComplete: (moduleId: string) => void;
  lastVisited: string | null;
  recordVisit: (moduleId: string) => void;
  nextModule: () => string;
  resetProgress: () => void;
  loaded: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

function readStoredProgress(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const validIds = new Set(allModules.map((m) => m.id));
    const valid = parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id));
    return Array.from(new Set(valid));
  } catch {
    return [];
  }
}

// localStorage.setItem/removeItem can throw (private browsing with storage
// disabled, quota exceeded). These swallow that so progress tracking
// degrades to in-memory-only for the session instead of crashing the app.
function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore — state still updates in memory via the caller's setState
  }
}

function safeRemoveItem(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [lastVisited, setLastVisited] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCompleted(readStoredProgress());
    const visited = localStorage.getItem(LAST_VISITED_KEY);
    if (visited && allModules.some((m) => m.id === visited)) {
      setLastVisited(visited);
    }
    setLoaded(true);
  }, []);

  const persist = (ids: string[]) => {
    setCompleted(ids);
    safeSetItem(STORAGE_KEY, JSON.stringify(ids));
  };

  const markComplete = useCallback((moduleId: string) => {
    setCompleted((prev) => {
      if (prev.includes(moduleId)) return prev;
      const next = [...prev, moduleId];
      safeSetItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const unmarkComplete = useCallback((moduleId: string) => {
    setCompleted((prev) => {
      if (!prev.includes(moduleId)) return prev;
      const next = prev.filter((id) => id !== moduleId);
      safeSetItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const recordVisit = useCallback((moduleId: string) => {
    setLastVisited(moduleId);
    safeSetItem(LAST_VISITED_KEY, moduleId);
  }, []);

  const isComplete = useCallback(
    (moduleId: string) => completed.includes(moduleId),
    [completed]
  );

  // Where a learner should go next: the last page they were on if unfinished,
  // otherwise the first incomplete module in curriculum order.
  const nextModule = useCallback(() => {
    if (lastVisited && !completed.includes(lastVisited)) return lastVisited;
    const firstIncomplete = allModules.find((m) => !completed.includes(m.id));
    return firstIncomplete ? firstIncomplete.id : allModules[0].id;
  }, [lastVisited, completed]);

  const resetProgress = useCallback(() => {
    persist([]);
    setLastVisited(null);
    safeRemoveItem(LAST_VISITED_KEY);
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        completed,
        completedCount: completed.length,
        totalCount: moduleCount,
        isComplete,
        markComplete,
        unmarkComplete,
        lastVisited,
        recordVisit,
        nextModule,
        resetProgress,
        loaded,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
