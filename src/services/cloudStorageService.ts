// Cloud Storage Service using Firebase Firestore
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { User, UserProgress, GameSession } from '../types';

export class CloudStorageService {
  // User profile operations
  static async saveUserProfile(user: User): Promise<void> {
    try {
      console.log('💾 Attempting to save user profile to Firestore:', user.id);
      
      const userRef = doc(db, 'users', user.id);
      const userData = {
        ...user,
        updatedAt: serverTimestamp()
      };
      console.log('📄 User data to save:', userData);
      
      await setDoc(userRef, userData, { merge: true });
      console.log('✅ User profile saved successfully to Firestore');
    } catch (error: any) {
      console.error('❌ Error saving user profile to Firestore:', error);
      if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
        console.error('🔍 Error details:', error.code, error.message);
      }
      throw error;
    }
  }

  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data() as any;
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          level: data.level,
          experience: data.experience,
          totalScore: data.totalScore,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          lastLoginAt: data.lastLoginAt?.toDate?.()?.toISOString() || data.lastLoginAt,
        } as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  static async updateUserExperience(userId: string, experienceGained: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        experience: increment(experienceGained),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user experience:', error);
      throw error;
    }
  }

  static async updateUserLevel(userId: string, newLevel: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        level: newLevel,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user level:', error);
      throw error;
    }
  }

  // User progress operations
  static async saveUserProgress(progress: UserProgress[]): Promise<void> {
    try {
      console.log('📈 Attempting to save user progress to Firestore:', progress.length, 'items');
      
      const batch = progress.map(async (prog) => {
        console.log('📊 Saving progress for character:', prog.characterId, 'user:', prog.userId);
        const progressRef = doc(db, 'userProgress', `${prog.userId}_${prog.characterId}`);
        await setDoc(progressRef, {
          ...prog,
          updatedAt: serverTimestamp()
        }, { merge: true });
      });
      
      await Promise.all(batch);
      console.log('✅ User progress saved successfully to Firestore');
    } catch (error) {
      console.error('Error saving user progress:', error);
      throw error;
    }
  }

  static async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      const progressQuery = query(
        collection(db, 'userProgress'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(progressQuery);
      const progress: UserProgress[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        progress.push({
          ...data,
          lastAttemptAt: data.lastAttemptAt?.toDate?.()?.toISOString() || data.lastAttemptAt
        } as UserProgress);
      });
      
      return progress;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return [];
    }
  }

  // Game session operations
  static async saveGameSession(session: GameSession): Promise<string> {
    try {
      const sessionRef = await addDoc(collection(db, 'gameSessions'), {
        ...session,
        createdAt: serverTimestamp()
      });
      
      return sessionRef.id;
    } catch (error) {
      console.error('Error saving game session:', error);
      throw error;
    }
  }

  static async updateGameSession(sessionId: string, updates: Partial<GameSession>): Promise<void> {
    try {
      const sessionRef = doc(db, 'gameSessions', sessionId);
      await updateDoc(sessionRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating game session:', error);
      throw error;
    }
  }

  // Achievements operations
  static async saveUserAchievements(userId: string, achievementIds: string[]): Promise<void> {
    try {
      const achievementsRef = doc(db, 'userAchievements', userId);
      await setDoc(achievementsRef, {
        userId,
        unlockedAchievements: achievementIds,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving user achievements:', error);
      throw error;
    }
  }

  static async getUserAchievements(userId: string): Promise<string[]> {
    try {
      const achievementsRef = doc(db, 'userAchievements', userId);
      const achievementsSnap = await getDoc(achievementsRef);
      
      if (achievementsSnap.exists()) {
        return achievementsSnap.data().unlockedAchievements || [];
      }
      
      return [];
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  // Analytics and statistics
  static async getUserStats(userId: string): Promise<{
    totalSessions: number;
    totalCharactersLearned: number;
    averageScore: number;
    totalTimeSpent: number;
  }> {
    try {
      const sessionsQuery = query(
        collection(db, 'gameSessions'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(sessionsQuery);
      let totalSessions = 0;
      let totalScore = 0;
      let totalTime = 0;
      
      querySnapshot.forEach((doc) => {
        const session = doc.data() as GameSession;
        if (session.completedAt) {
          totalSessions++;
          totalScore += session.score;
          totalTime += session.timeSpent;
        }
      });
      
      const progress = await this.getUserProgress(userId);
      const totalCharactersLearned = progress.filter(p => p.mastered).length;
      
      return {
        totalSessions,
        totalCharactersLearned,
        averageScore: totalSessions > 0 ? Math.round(totalScore / totalSessions) : 0,
        totalTimeSpent: totalTime
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalSessions: 0,
        totalCharactersLearned: 0,
        averageScore: 0,
        totalTimeSpent: 0
      };
    }
  }
}