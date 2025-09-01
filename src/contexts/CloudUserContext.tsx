import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Achievement, UserProgress } from '../types';
import { CloudStorageService } from '../services/cloudStorageService';
import { signInAnonymously, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

interface GoogleUserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface CloudUserContextType {
  user: User | null;
  achievements: Achievement[];
  userProgress: UserProgress[];
  isLoading: boolean;
  updateUser: (user: User) => void;
  addExperience: (amount: number) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  updateProgress: (characterId: string, correct: boolean) => Promise<void>;
  isLoggedIn: boolean;
  login: (userData: Partial<User>) => void;
  loginWithGoogle: (googleData: GoogleUserData, googleAccessToken?: string) => Promise<void>;
  logout: () => void;
  syncToCloud: () => Promise<void>;
  getCloudStats: () => Promise<{
    totalSessions: number;
    totalCharactersLearned: number;
    averageScore: number;
    totalTimeSpent: number;
  }>;
}

const CloudUserContext = createContext<CloudUserContextType | undefined>(undefined);

// Mock achievements data - same as before
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

export const CloudUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [achievements] = useState<Achievement[]>(mockAchievements);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Monitor Firebase auth state - disabled for now since we're using Google ID directly
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (authUser) => {
  //     console.log('🔥 Firebase auth state changed:', authUser?.uid);
  //     setFirebaseUser(authUser);
  //     
  //     if (authUser && !user) {
  //       // Load user data when Firebase auth is ready
  //       loadUserFromCloud(authUser.uid);
  //     }
  //   });

  //   return unsubscribe;
  // }, [user]);

  // Load user data from localStorage on mount (fallback)
  useEffect(() => {
    const savedUser = localStorage.getItem('chineseGameUser');
    if (savedUser && !user && !firebaseUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      console.log('📱 Loaded user from localStorage:', parsedUser.id);
    }
  }, [user, firebaseUser]);

  // Save user data to localStorage (fallback)
  useEffect(() => {
    if (user) {
      localStorage.setItem('chineseGameUser', JSON.stringify(user));
    }
  }, [user]);

  const loadUserFromCloud = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Load user profile
      const cloudUser = await CloudStorageService.getUserProfile(userId);
      if (cloudUser) {
        setUser(cloudUser);
      }
      
      // Load user progress
      const cloudProgress = await CloudStorageService.getUserProgress(userId);
      setUserProgress(cloudProgress);
      
      // Load achievements
      const cloudAchievements = await CloudStorageService.getUserAchievements(userId);
      setUnlockedAchievements(cloudAchievements);
      
    } catch (error) {
      console.error('Error loading user from cloud:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncToCloud = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Save user profile
      await CloudStorageService.saveUserProfile(user);
      
      // Save user progress
      if (userProgress.length > 0) {
        await CloudStorageService.saveUserProgress(userProgress);
      }
      
      // Save achievements
      if (unlockedAchievements.length > 0) {
        await CloudStorageService.saveUserAchievements(user.id, unlockedAchievements);
      }
      
    } catch (error) {
      console.error('Error syncing to cloud:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLevel = (experience: number): number => {
    return Math.floor(experience / 1000) + 1;
  };

  const updateUser = (userData: User) => {
    console.log('🔄 Updating user data:', userData.id, userData.name);
    setUser(userData);
    // Auto-sync to cloud
    CloudStorageService.saveUserProfile(userData)
      .then(() => console.log('✅ User profile auto-sync completed'))
      .catch(error => console.error('❌ User profile auto-sync failed:', error));
  };

  const addExperience = async (amount: number) => {
    if (!user) {
      console.warn('⚠️ Cannot add experience: user is null');
      return;
    }

    console.log(`🎯 Adding ${amount} experience to user ${user.id} (${user.name})`);
    console.log(`📊 Current experience: ${user.experience} → New: ${user.experience + amount}`);

    const newExperience = user.experience + amount;
    const newLevel = calculateLevel(newExperience);
    const newTotalScore = user.totalScore + amount; // Also update total score
    
    const updatedUser = {
      ...user,
      experience: newExperience,
      level: newLevel,
      totalScore: newTotalScore
    };
    
    console.log('🔄 Updating user state with new experience and score:', updatedUser);
    setUser(updatedUser);

    // Sync to cloud
    try {
      console.log('☁️ Syncing experience update to cloud...');
      await CloudStorageService.updateUserExperience(user.id, amount);
      
      if (newLevel !== user.level) {
        console.log(`🎉 Level up! ${user.level} → ${newLevel}`);
        await CloudStorageService.updateUserLevel(user.id, newLevel);
      }
      
      // Also update the complete user profile to sync totalScore
      await CloudStorageService.saveUserProfile(updatedUser);
      console.log('✅ Experience sync completed successfully');
    } catch (error) {
      console.error('❌ Error updating experience in cloud:', error);
    }

    // Check for level-up achievements
    checkAchievements(newTotalScore, newExperience, getLearnedCharactersCount());
  };

  const getLearnedCharactersCount = (): number => {
    return userProgress.filter(p => p.mastered).length;
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!unlockedAchievements.includes(achievementId)) {
      const newAchievements = [...unlockedAchievements, achievementId];
      setUnlockedAchievements(newAchievements);
      
      // Sync to cloud
      if (user) {
        try {
          await CloudStorageService.saveUserAchievements(user.id, newAchievements);
        } catch (error) {
          console.error('Error saving achievement to cloud:', error);
        }
      }
      
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

  const updateProgress = async (characterId: string, correct: boolean) => {
    if (!user) {
      console.warn('⚠️ Cannot update progress: user is null');
      return;
    }

    console.log(`📈 Updating progress for character ${characterId}: ${correct ? 'CORRECT' : 'INCORRECT'} for user ${user.id}`);

    const newProgress = [...userProgress];
    const existingProgress = newProgress.find(p => p.characterId === characterId);
    
    if (existingProgress) {
      console.log(`📊 Existing progress found: ${existingProgress.correctAttempts}/${existingProgress.attempts} attempts`);
      existingProgress.attempts += 1;
      existingProgress.correctAttempts += correct ? 1 : 0;
      existingProgress.lastAttemptAt = new Date().toISOString();
      existingProgress.mastered = existingProgress.correctAttempts >= 3;
      console.log(`📊 Updated progress: ${existingProgress.correctAttempts}/${existingProgress.attempts} attempts, mastered: ${existingProgress.mastered}`);
    } else {
      console.log('📝 Creating new progress entry for character');
      const newProgressItem: UserProgress = {
        userId: user.id,
        characterId,
        attempts: 1,
        correctAttempts: correct ? 1 : 0,
        lastAttemptAt: new Date().toISOString(),
        mastered: false
      };
      newProgress.push(newProgressItem);
    }
    
    setUserProgress(newProgress);

    // Sync to cloud
    try {
      console.log('☁️ Syncing progress to cloud...');
      const progressToSave = existingProgress || newProgress[newProgress.length - 1];
      await CloudStorageService.saveUserProgress([progressToSave]);
      console.log('✅ Progress sync completed successfully');
    } catch (error) {
      console.error('❌ Error updating progress in cloud:', error);
    }

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
    // Auto-sync to cloud
    CloudStorageService.saveUserProfile(newUser).catch(console.error);
  };

  const loginWithGoogle = async (googleData: GoogleUserData, googleAccessToken?: string) => {
    try {
      setIsLoading(true);
      console.log('🚀 Starting Google login process for:', googleData.email);
      
      // Use Google ID for consistency and simplicity
      const userId = googleData.id;
      console.log('👤 Using Google ID as user ID:', userId);
      
      // Optional: Sign in anonymously to Firebase for database rules
      // This gives us request.auth in Firestore rules without complex OAuth setup
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
          console.log('🔐 Firebase anonymous auth established for database security');
        }
      } catch (authError) {
        console.warn('⚠️ Firebase anonymous auth failed, using open rules:', authError);
      }
      
      // Check if user exists in cloud first
      const existingUser = await CloudStorageService.getUserProfile(userId);
      
      if (existingUser) {
        console.log('👤 Existing user found in Firestore:', existingUser.id, existingUser.name);
        console.log('🔄 Updating existing user profile with fresh login data');
        // Update existing user's login time
        const updatedUser: User = {
          ...existingUser,
          name: googleData.name,
          email: googleData.email,
          avatar: googleData.avatar,
          lastLoginAt: new Date().toISOString(),
        };
        setUser(updatedUser);
        console.log('💾 Saving updated user profile to Firestore');
        await CloudStorageService.saveUserProfile(updatedUser);
        
        // Load user data
        console.log('📥 Loading complete user data from cloud');
        await loadUserFromCloud(userId);
        console.log('✅ Login process completed for existing user');
      } else {
        console.log('🆕 New user detected, creating fresh profile');
        // Create new user
        const newUser: User = {
          id: userId,
          name: googleData.name,
          email: googleData.email,
          avatar: googleData.avatar,
          level: 1,
          experience: 0,
          totalScore: 0,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        setUser(newUser);
        console.log('💾 Saving new user to Firestore:', newUser);
        await CloudStorageService.saveUserProfile(newUser);
        console.log('✅ Login process completed for new user');
      }
    } catch (error) {
      console.error('❌ Error logging in with Google:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      console.log('🚪 Signed out from Firebase');
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
    }
    
    setUser(null);
    setUserProgress([]);
    setUnlockedAchievements([]);
    setFirebaseUser(null);
    localStorage.removeItem('chineseGameUser');
    localStorage.removeItem('chineseGameProgress');
    localStorage.removeItem('chineseGameAchievements');
  };

  const getCloudStats = async () => {
    if (!user) {
      return { totalSessions: 0, totalCharactersLearned: 0, averageScore: 0, totalTimeSpent: 0 };
    }
    
    return await CloudStorageService.getUserStats(user.id);
  };

  const value: CloudUserContextType = {
    user,
    achievements: achievements.map(a => ({
      ...a,
      unlocked: unlockedAchievements.includes(a.id)
    })) as Achievement[],
    userProgress,
    isLoading,
    updateUser,
    addExperience,
    unlockAchievement,
    updateProgress,
    isLoggedIn: !!user,
    login,
    loginWithGoogle,
    logout,
    syncToCloud,
    getCloudStats
  };

  return (
    <CloudUserContext.Provider value={value}>
      {children}
    </CloudUserContext.Provider>
  );
};

export const useCloudUser = () => {
  const context = useContext(CloudUserContext);
  if (context === undefined) {
    throw new Error('useCloudUser must be used within a CloudUserProvider');
  }
  return context;
};