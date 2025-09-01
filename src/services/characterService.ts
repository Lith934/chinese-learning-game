import { ChineseCharacter } from '../types';
import { getCharactersByLevel, getCharactersByCategoryAndLevel } from '../data/characters';

export interface CharacterSelectionOptions {
  userLevel: number;
  count?: number;
  category?: string;
  excludeIds?: string[];
}

export class CharacterService {
  // Select characters intelligently based on user progress
  static selectCharactersForUser(options: CharacterSelectionOptions): ChineseCharacter[] {
    const {
      userLevel,
      count = 10,
      category,
      excludeIds = []
    } = options;

    let availableCharacters: ChineseCharacter[];

    // Get base character set
    if (category) {
      availableCharacters = getCharactersByCategoryAndLevel(category, userLevel, count * 2);
    } else {
      availableCharacters = getCharactersByLevel(userLevel, count * 2);
    }

    // Filter out excluded characters
    availableCharacters = availableCharacters.filter(char => !excludeIds.includes(char.id));

    // Add some variety by including characters from different difficulty levels
    const difficultyMix = this.createDifficultyMix(userLevel);
    
    const selectedCharacters: ChineseCharacter[] = [];
    
    // Select characters based on difficulty distribution
    for (const [difficulty, percentage] of Object.entries(difficultyMix)) {
      const targetCount = Math.ceil(count * percentage);
      const difficultyLevel = parseInt(difficulty);
      
      const difficultChars = availableCharacters.filter(
        char => char.difficulty === difficultyLevel && !selectedCharacters.includes(char)
      );
      
      // Shuffle and take the required amount
      const shuffled = this.shuffleArray([...difficultChars]);
      const selected = shuffled.slice(0, Math.min(targetCount, difficultChars.length));
      selectedCharacters.push(...selected);
    }

    // Fill remaining slots if needed
    const remaining = count - selectedCharacters.length;
    if (remaining > 0) {
      const remainingChars = availableCharacters.filter(
        char => !selectedCharacters.includes(char)
      );
      const shuffledRemaining = this.shuffleArray(remainingChars);
      selectedCharacters.push(...shuffledRemaining.slice(0, remaining));
    }

    return this.shuffleArray(selectedCharacters.slice(0, count));
  }

  // Get maximum difficulty level for a user level
  private static getMaxDifficultyForLevel(userLevel: number): number {
    if (userLevel <= 5) return 1;
    if (userLevel <= 15) return 2;
    if (userLevel <= 30) return 3;
    return 4;
  }

  // Create a difficulty mix for varied learning experience
  private static createDifficultyMix(userLevel: number): Record<number, number> {
    if (userLevel <= 3) {
      // Complete beginners - only easiest characters
      return { 1: 1.0 };
    } else if (userLevel <= 8) {
      // Early learners - mostly easy, some level 2
      return { 1: 0.8, 2: 0.2 };
    } else if (userLevel <= 15) {
      // Intermediate beginners - mix of level 1 and 2
      return { 1: 0.6, 2: 0.4 };
    } else if (userLevel <= 25) {
      // Intermediate - balanced mix with some level 3
      return { 1: 0.3, 2: 0.5, 3: 0.2 };
    } else if (userLevel <= 35) {
      // Advanced intermediate - focus on 2 and 3, introduce 4
      return { 2: 0.4, 3: 0.5, 4: 0.1 };
    } else {
      // Advanced - challenging mix
      return { 2: 0.2, 3: 0.5, 4: 0.3 };
    }
  }

  // Fisher-Yates shuffle algorithm
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Get learning recommendations based on user progress
  static getLearningRecommendations(userLevel: number): {
    description: string;
    focus: string[];
    nextMilestone: string;
  } {
    if (userLevel <= 5) {
      return {
        description: "Building your foundation with the most essential Chinese characters",
        focus: ["Basic pronouns (我, 你, 他)", "Simple verbs (是, 有, 去)", "Common particles (的, 了)"],
        nextMilestone: "Master 50 basic characters to advance to everyday vocabulary"
      };
    } else if (userLevel <= 15) {
      return {
        description: "Learning everyday characters for practical communication",
        focus: ["Family and relationships", "Daily activities", "Time expressions"],
        nextMilestone: "Complete 150 characters to reach intermediate level"
      };
    } else if (userLevel <= 30) {
      return {
        description: "Expanding to intermediate vocabulary for deeper conversations",
        focus: ["Abstract concepts", "Workplace vocabulary", "Cultural expressions"],
        nextMilestone: "Master 300 characters to unlock advanced content"
      };
    } else {
      return {
        description: "Mastering advanced characters for fluent expression",
        focus: ["Literary expressions", "Specialized vocabulary", "Nuanced meanings"],
        nextMilestone: "Continue practicing to maintain and expand your expertise"
      };
    }
  }
}