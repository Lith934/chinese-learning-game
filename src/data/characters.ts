import { ChineseCharacter } from '../types';

// Character frequency data based on HSK levels and common usage
// Level 1: Most common characters (HSK 1-2, 150-300 characters)
// Level 2: Common characters (HSK 3, 300-600 characters) 
// Level 3: Intermediate characters (HSK 4, 600-1200 characters)
// Level 4: Advanced characters (HSK 5-6, 1200+ characters)

export const chineseCharacters: ChineseCharacter[] = [
  // Level 1 - Most Common Characters (HSK 1-2 level)
  { id: '1', character: '的', pinyin: 'de', meaning: 'possessive particle', difficulty: 1, category: 'particles' },
  { id: '2', character: '一', pinyin: 'yī', meaning: 'one', difficulty: 1, category: 'numbers' },
  { id: '3', character: '是', pinyin: 'shì', meaning: 'to be', difficulty: 1, category: 'verbs' },
  { id: '4', character: '了', pinyin: 'le', meaning: 'completed action particle', difficulty: 1, category: 'particles' },
  { id: '5', character: '人', pinyin: 'rén', meaning: 'person', difficulty: 1, category: 'nouns' },
  { id: '6', character: '我', pinyin: 'wǒ', meaning: 'I/me', difficulty: 1, category: 'pronouns' },
  { id: '7', character: '在', pinyin: 'zài', meaning: 'at/in/on', difficulty: 1, category: 'prepositions' },
  { id: '8', character: '有', pinyin: 'yǒu', meaning: 'to have', difficulty: 1, category: 'verbs' },
  { id: '9', character: '他', pinyin: 'tā', meaning: 'he/him', difficulty: 1, category: 'pronouns' },
  { id: '10', character: '这', pinyin: 'zhè', meaning: 'this', difficulty: 1, category: 'pronouns' },
  { id: '11', character: '个', pinyin: 'gè', meaning: 'measure word', difficulty: 1, category: 'measure_words' },
  { id: '12', character: '们', pinyin: 'men', meaning: 'plural suffix', difficulty: 1, category: 'particles' },
  { id: '13', character: '好', pinyin: 'hǎo', meaning: 'good', difficulty: 1, category: 'adjectives' },
  { id: '14', character: '来', pinyin: 'lái', meaning: 'to come', difficulty: 1, category: 'verbs' },
  { id: '15', character: '就', pinyin: 'jiù', meaning: 'then/at once', difficulty: 1, category: 'adverbs' },
  { id: '16', character: '你', pinyin: 'nǐ', meaning: 'you', difficulty: 1, category: 'pronouns' },
  { id: '17', character: '什', pinyin: 'shén', meaning: 'what', difficulty: 1, category: 'question_words' },
  { id: '18', character: '么', pinyin: 'me', meaning: 'question particle', difficulty: 1, category: 'particles' },
  { id: '19', character: '时', pinyin: 'shí', meaning: 'time', difficulty: 1, category: 'nouns' },
  { id: '20', character: '候', pinyin: 'hòu', meaning: 'time (when)', difficulty: 1, category: 'nouns' },
  { id: '21', character: '会', pinyin: 'huì', meaning: 'can/will', difficulty: 1, category: 'verbs' },
  { id: '22', character: '说', pinyin: 'shuō', meaning: 'to say', difficulty: 1, category: 'verbs' },
  { id: '23', character: '去', pinyin: 'qù', meaning: 'to go', difficulty: 1, category: 'verbs' },
  { id: '24', character: '看', pinyin: 'kàn', meaning: 'to look/see', difficulty: 1, category: 'verbs' },
  { id: '25', character: '做', pinyin: 'zuò', meaning: 'to do', difficulty: 1, category: 'verbs' },
  { id: '26', character: '很', pinyin: 'hěn', meaning: 'very', difficulty: 1, category: 'adverbs' },
  { id: '27', character: '大', pinyin: 'dà', meaning: 'big', difficulty: 1, category: 'adjectives' },
  { id: '28', character: '小', pinyin: 'xiǎo', meaning: 'small', difficulty: 1, category: 'adjectives' },
  { id: '29', character: '多', pinyin: 'duō', meaning: 'many/much', difficulty: 1, category: 'adjectives' },
  { id: '30', character: '少', pinyin: 'shǎo', meaning: 'few/little', difficulty: 1, category: 'adjectives' },

  // Level 2 - Common Characters  
  { id: '31', character: '想', pinyin: 'xiǎng', meaning: 'to think/want', difficulty: 2, category: 'verbs' },
  { id: '32', character: '知', pinyin: 'zhī', meaning: 'to know', difficulty: 2, category: 'verbs' },
  { id: '33', character: '道', pinyin: 'dào', meaning: 'way/path', difficulty: 2, category: 'nouns' },
  { id: '34', character: '年', pinyin: 'nián', meaning: 'year', difficulty: 2, category: 'nouns' },
  { id: '35', character: '月', pinyin: 'yuè', meaning: 'month', difficulty: 2, category: 'nouns' },
  { id: '36', character: '日', pinyin: 'rì', meaning: 'day/sun', difficulty: 2, category: 'nouns' },
  { id: '37', character: '国', pinyin: 'guó', meaning: 'country', difficulty: 2, category: 'nouns' },
  { id: '38', character: '家', pinyin: 'jiā', meaning: 'home/family', difficulty: 2, category: 'nouns' },
  { id: '39', character: '中', pinyin: 'zhōng', meaning: 'middle/China', difficulty: 2, category: 'nouns' },
  { id: '40', character: '文', pinyin: 'wén', meaning: 'language/culture', difficulty: 2, category: 'nouns' },
  { id: '41', character: '学', pinyin: 'xué', meaning: 'to study', difficulty: 2, category: 'verbs' },
  { id: '42', character: '生', pinyin: 'shēng', meaning: 'life/student', difficulty: 2, category: 'nouns' },
  { id: '43', character: '工', pinyin: 'gōng', meaning: 'work', difficulty: 2, category: 'nouns' },
  { id: '44', character: '作', pinyin: 'zuò', meaning: 'to work', difficulty: 2, category: 'verbs' },
  { id: '45', character: '朋', pinyin: 'péng', meaning: 'friend', difficulty: 2, category: 'nouns' },
  { id: '46', character: '友', pinyin: 'yǒu', meaning: 'friend', difficulty: 2, category: 'nouns' },
  { id: '47', character: '吃', pinyin: 'chī', meaning: 'to eat', difficulty: 2, category: 'verbs' },
  { id: '48', character: '喝', pinyin: 'hē', meaning: 'to drink', difficulty: 2, category: 'verbs' },
  { id: '49', character: '买', pinyin: 'mǎi', meaning: 'to buy', difficulty: 2, category: 'verbs' },
  { id: '50', character: '卖', pinyin: 'mài', meaning: 'to sell', difficulty: 2, category: 'verbs' },

  // Level 3 - Intermediate Characters
  { id: '51', character: '希', pinyin: 'xī', meaning: 'to hope', difficulty: 3, category: 'verbs' },
  { id: '52', character: '望', pinyin: 'wàng', meaning: 'to hope/look', difficulty: 3, category: 'verbs' },
  { id: '53', character: '忘', pinyin: 'wàng', meaning: 'to forget', difficulty: 3, category: 'verbs' },
  { id: '54', character: '记', pinyin: 'jì', meaning: 'to remember', difficulty: 3, category: 'verbs' },
  { id: '55', character: '得', pinyin: 'děi', meaning: 'must/get', difficulty: 3, category: 'verbs' },
  { id: '56', character: '应', pinyin: 'yīng', meaning: 'should', difficulty: 3, category: 'verbs' },
  { id: '57', character: '该', pinyin: 'gāi', meaning: 'should', difficulty: 3, category: 'verbs' },
  { id: '58', character: '须', pinyin: 'xū', meaning: 'must', difficulty: 3, category: 'verbs' },
  { id: '59', character: '要', pinyin: 'yào', meaning: 'to want', difficulty: 3, category: 'verbs' },
  { id: '60', character: '需', pinyin: 'xū', meaning: 'to need', difficulty: 3, category: 'verbs' },
  { id: '61', character: '经', pinyin: 'jīng', meaning: 'through/experience', difficulty: 3, category: 'nouns' },
  { id: '62', character: '历', pinyin: 'lì', meaning: 'experience', difficulty: 3, category: 'nouns' },
  { id: '63', character: '史', pinyin: 'shǐ', meaning: 'history', difficulty: 3, category: 'nouns' },
  { id: '64', character: '社', pinyin: 'shè', meaning: 'society', difficulty: 3, category: 'nouns' },
  { id: '65', character: '会', pinyin: 'huì', meaning: 'society/meeting', difficulty: 3, category: 'nouns' },

  // Level 4 - Advanced Characters
  { id: '66', character: '辉', pinyin: 'huī', meaning: 'brilliance', difficulty: 4, category: 'adjectives' },
  { id: '67', character: '煌', pinyin: 'huáng', meaning: 'brilliant', difficulty: 4, category: 'adjectives' },
  { id: '68', character: '璀', pinyin: 'cuī', meaning: 'lustrous', difficulty: 4, category: 'adjectives' },
  { id: '69', character: '璨', pinyin: 'càn', meaning: 'bright', difficulty: 4, category: 'adjectives' },
  { id: '70', character: '瑰', pinyin: 'guī', meaning: 'precious', difficulty: 4, category: 'adjectives' },
  { id: '71', character: '奇', pinyin: 'qí', meaning: 'strange/odd', difficulty: 4, category: 'adjectives' },
  { id: '72', character: '异', pinyin: 'yì', meaning: 'different', difficulty: 4, category: 'adjectives' },
  { id: '73', character: '罕', pinyin: 'hǎn', meaning: 'rare', difficulty: 4, category: 'adjectives' },
  { id: '74', character: '鲜', pinyin: 'xiān', meaning: 'fresh/rare', difficulty: 4, category: 'adjectives' },
  { id: '75', character: '睿', pinyin: 'ruì', meaning: 'wise', difficulty: 4, category: 'adjectives' },
];

// Helper function to get characters by difficulty level
export const getCharactersByLevel = (userLevel: number, count: number = 10): ChineseCharacter[] => {
  // Calculate difficulty range based on user level
  let maxDifficulty: number;
  if (userLevel <= 5) maxDifficulty = 1;
  else if (userLevel <= 15) maxDifficulty = 2;
  else if (userLevel <= 30) maxDifficulty = 3;
  else maxDifficulty = 4;

  // Get characters within the difficulty range
  const availableCharacters = chineseCharacters.filter(
    char => char.difficulty <= maxDifficulty
  );

  // Shuffle and return requested count
  const shuffled = [...availableCharacters].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Helper function to get characters by category and level
export const getCharactersByCategoryAndLevel = (
  category: string, 
  userLevel: number, 
  count: number = 10
): ChineseCharacter[] => {
  const levelFilteredChars = getCharactersByLevel(userLevel, chineseCharacters.length);
  const categoryFiltered = levelFilteredChars.filter(char => char.category === category);
  
  return categoryFiltered.slice(0, Math.min(count, categoryFiltered.length));
};

// Get available categories for a given level
export const getAvailableCategories = (userLevel: number): string[] => {
  const availableChars = getCharactersByLevel(userLevel, chineseCharacters.length);
  const categorySet = new Set(availableChars.map(char => char.category));
  const categories: string[] = [];
  categorySet.forEach(category => categories.push(category));
  return categories.sort();
};