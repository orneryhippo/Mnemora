
export enum MemoryCategory {
  Working = 'Working Memory',
  Declarative = 'Long-Term Declarative',
  Associative = 'Associative & Semantic',
  Fluency = 'Speed & Recall Fluency'
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: MemoryCategory;
  difficulty: number;
  icon: string;
}

export interface UserStats {
  xp: number;
  streak: number;
  level: number;
  totalSessions: number;
  lastTrained: string;
  memoryProfile: {
    accuracy: number;
    latency: number;
    retentionRate: number;
  };
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  nextReview: number; // timestamp
  interval: number; // days
  ease: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  thought?: string;
}
