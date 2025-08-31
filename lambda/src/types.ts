export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  experience: number;
  totalScore: number;
  createdAt: string;
  lastLoginAt: string;
}

export interface ChineseCharacter {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: string;
  audioUrl?: string;
  strokeOrder?: string[];
}

export interface GameSession {
  id: string;
  userId: string;
  charactersStudied: string[];
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  startedAt: string;
  completedAt?: string;
}

export interface UserProgress {
  userId: string;
  characterId: string;
  attempts: number;
  correctAttempts: number;
  lastAttemptAt: string;
  mastered: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'score' | 'streak' | 'characters_learned' | 'time_played';
}

export interface APIResponse<T = any> {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
  };
  body: string;
}