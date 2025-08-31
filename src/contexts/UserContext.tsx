import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Achievement, UserProgress } from '../types';

interface UserContextType {
  user: User | null;
  achievements: Achievement[];
  userProgress: UserProgress[];
  updateUser: (user: User) => void;
  addExperience: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateProgress: (characterId: string, correct: boolean) => void;
  isLoggedIn: boolean;
  login: (userData: Partial<User>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock achievements data
const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Learn your first 10 characters',
    icon: '👶',
    requirement: 10,
    type: 'characters_learned'
  },
  {
    id: '2',
    title: 'Perfect Score',
    description: 'Get 100% accuracy in a game session',
    icon: '🎯',
    requirement: 100,
    type: 'score'
  },
  {
    id: '3',
    title: 'Hot Streak',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    requirement: 7,
    type: 'streak'
  },
  {
    id: '4',
    title: 'Scholar',
    description: 'Learn 50 characters',
    icon: '🎓',
    requirement: 50,
    type: 'characters_learned'
  },
  {
    id: '5',
    title: 'Master',
    description: 'Learn 100 characters',
    icon: '🏆',
    requirement: 100,
    type: 'characters_learned'
  },
  {
    id: '6',
    title: 'Speed Learner',
    description: 'Complete a session in under 2 minutes',
    icon: '⚡',
    requirement: 120,
    type: 'time_played'
  }
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [achievements] = useState<Achievement[]>(mockAchievements);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('chineseGameUser');
    const savedProgress = localStorage.getItem('chineseGameProgress');
    const savedAchievements = localStorage.getItem('chineseGameAchievements');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    if (savedAchievements) {
      setUnlockedAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('chineseGameUser', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('chineseGameProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('chineseGameAchievements', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  const calculateLevel = (experience: number): number => {
    // Simple level calculation: every 1000 XP = 1 level
    return Math.floor(experience / 1000) + 1;
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const addExperience = (amount: number) => {
    if (!user) return;

    const newExperience = user.experience + amount;
    const newLevel = calculateLevel(newExperience);
    
    setUser({
      ...user,
      experience: newExperience,
      level: newLevel
    });

    // Check for level-up achievements
    checkAchievements(user.totalScore, newExperience, getLearnedCharactersCount());
  };

  const getLearnedCharactersCount = (): number => {
    return userProgress.filter(p => p.mastered).length;
  };

  const unlockAchievement = (achievementId: string) => {
    if (!unlockedAchievements.includes(achievementId)) {
      setUnlockedAchievements(prev => [...prev, achievementId]);
      // You could show a notification here
      console.log('🎉 Achievement unlocked!', achievements.find(a => a.id === achievementId)?.title);
    }
  };

  const checkAchievements = (score: number, experience: number, charactersLearned: number) => {
    achievements.forEach(achievement => {
      if (unlockedAchievements.includes(achievement.id)) return;

      let shouldUnlock = false;
      
      switch (achievement.type) {
        case 'characters_learned':
          shouldUnlock = charactersLearned >= achievement.requirement;
          break;
        case 'score':
          shouldUnlock = score >= achievement.requirement;
          break;
        // Add more achievement types as needed
      }

      if (shouldUnlock) {
        unlockAchievement(achievement.id);
      }
    });
  };

  const updateProgress = (characterId: string, correct: boolean) => {
    if (!user) return;

    setUserProgress(prev => {
      const existingProgress = prev.find(p => p.characterId === characterId);
      
      if (existingProgress) {
        const updatedProgress = {
          ...existingProgress,
          attempts: existingProgress.attempts + 1,
          correctAttempts: existingProgress.correctAttempts + (correct ? 1 : 0),
          lastAttemptAt: new Date().toISOString(),
          mastered: (existingProgress.correctAttempts + (correct ? 1 : 0)) >= 3 // Master after 3 correct attempts
        };
        
        return prev.map(p => p.characterId === characterId ? updatedProgress : p);
      } else {
        const newProgress: UserProgress = {
          userId: user.id,
          characterId,
          attempts: 1,
          correctAttempts: correct ? 1 : 0,
          lastAttemptAt: new Date().toISOString(),
          mastered: false
        };
        
        return [...prev, newProgress];
      }
    });

    // Check achievements after updating progress
    setTimeout(() => {
      checkAchievements(user.totalScore, user.experience, getLearnedCharactersCount());
    }, 100);
  };

  const login = (userData: Partial<User>) => {
    const newUser: User = {
      id: userData.id || Date.now().toString(),
      name: userData.name || 'Guest User',
      email: userData.email || '',
      avatar: userData.avatar,
      level: 1,
      experience: 0,
      totalScore: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setUserProgress([]);
    setUnlockedAchievements([]);
    localStorage.removeItem('chineseGameUser');
    localStorage.removeItem('chineseGameProgress');
    localStorage.removeItem('chineseGameAchievements');
  };

  const value: UserContextType = {
    user,
    achievements: achievements.map(a => ({
      ...a,
      // Add unlocked status for display purposes
      unlocked: unlockedAchievements.includes(a.id)
    })) as Achievement[],
    userProgress,
    updateUser,
    addExperience,
    unlockAchievement,
    updateProgress,
    isLoggedIn: !!user,
    login,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};