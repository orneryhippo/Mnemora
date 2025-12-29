
import React from 'react';
import { MemoryCategory, Exercise } from './types';

export const EXERCISES: Exercise[] = [
  {
    id: 'n-back',
    title: 'Visual N-Back',
    description: 'Track and match visual sequences to boost working memory capacity.',
    category: MemoryCategory.Working,
    difficulty: 2,
    icon: '🧠'
  },
  {
    id: 'paired-associates',
    title: 'Word Pairing',
    description: 'Build neural connections by linking unrelated word pairs.',
    category: MemoryCategory.Declarative,
    difficulty: 1,
    icon: '🔗'
  },
  {
    id: 'name-face',
    title: 'Name-Face Link',
    description: 'Practice associating names with faces using elaborative encoding.',
    category: MemoryCategory.Associative,
    difficulty: 3,
    icon: '👤'
  },
  {
    id: 'speed-recall',
    title: 'Timed Flash',
    description: 'Enhance retrieval speed with high-pressure recall drills.',
    category: MemoryCategory.Fluency,
    difficulty: 2,
    icon: '⚡'
  }
];

export const INITIAL_USER_STATS = {
  xp: 0,
  streak: 0,
  level: 1,
  totalSessions: 0,
  lastTrained: new Date().toISOString(),
  memoryProfile: {
    accuracy: 0.85,
    latency: 1200,
    retentionRate: 0.72
  }
};
