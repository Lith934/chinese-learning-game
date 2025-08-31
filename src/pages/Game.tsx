import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CharacterCard from '../components/Game/CharacterCard';
import GameProgress from '../components/Game/GameProgress';
import GameResults from '../components/Game/GameResults';
import { ChineseCharacter, GameSession } from '../types';
import { useUser } from '../contexts/UserContext';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Score = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ScoreValue = styled.div`
  font-size: ${props => props.theme.sizes.xl};
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const ScoreLabel = styled.div`
  font-size: ${props => props.theme.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const GameArea = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.xxl};
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  font-size: ${props => props.theme.sizes.lg};
  font-weight: 600;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xxl};
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);

  &:hover {
    transform: translateY(-2px);
  }
`;

// Mock character data - will be replaced with API call
const mockCharacters: ChineseCharacter[] = [
  {
    id: '1',
    character: '你',
    pinyin: 'nǐ',
    meaning: 'you',
    difficulty: 1,
    category: 'pronouns',
  },
  {
    id: '2',
    character: '好',
    pinyin: 'hǎo',
    meaning: 'good/well',
    difficulty: 1,
    category: 'adjectives',
  },
  {
    id: '3',
    character: '我',
    pinyin: 'wǒ',
    meaning: 'I/me',
    difficulty: 1,
    category: 'pronouns',
  },
  {
    id: '4',
    character: '是',
    pinyin: 'shì',
    meaning: 'to be/am/is/are',
    difficulty: 1,
    category: 'verbs',
  },
  {
    id: '5',
    character: '的',
    pinyin: 'de',
    meaning: 'possessive particle',
    difficulty: 2,
    category: 'particles',
  },
];

const Game: React.FC = () => {
  const { user, addExperience, updateProgress, login } = useUser();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed'>('ready');
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [characters, setCharacters] = useState<ChineseCharacter[]>([]);

  // Auto-login guest user if not logged in
  useEffect(() => {
    if (!user) {
      login({ name: '学习者' }); // Guest user with Chinese name
    }
  }, [user, login]);

  useEffect(() => {
    // Load characters based on user level - for now using mock data
    setCharacters(mockCharacters);
  }, []);

  const startGame = () => {
    if (!user) return;

    const session: GameSession = {
      id: Date.now().toString(),
      userId: user.id,
      charactersStudied: [],
      score: 0,
      correctAnswers: 0,
      totalQuestions: characters.length,
      timeSpent: 0,
      startedAt: new Date().toISOString(),
    };
    
    setGameSession(session);
    setGameState('playing');
    setCurrentCharacterIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(characters.length);
  };

  const handleAnswer = (isCorrect: boolean, points: number) => {
    const currentCharacter = characters[currentCharacterIndex];
    const newScore = score + (isCorrect ? points : 0);
    const newCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);
    
    setScore(newScore);
    setCorrectAnswers(newCorrectAnswers);
    
    // Update user progress and add experience
    updateProgress(currentCharacter.id, isCorrect);
    if (isCorrect) {
      addExperience(points);
    }
    
    if (gameSession) {
      const updatedSession = {
        ...gameSession,
        score: newScore,
        correctAnswers: newCorrectAnswers,
        charactersStudied: [...gameSession.charactersStudied, currentCharacter.id],
      };
      setGameSession(updatedSession);
    }

    // Move to next character or end game
    if (currentCharacterIndex + 1 >= characters.length) {
      setGameState('completed');
      if (gameSession) {
        setGameSession({
          ...gameSession,
          completedAt: new Date().toISOString(),
        });
      }
    } else {
      setTimeout(() => {
        setCurrentCharacterIndex(currentCharacterIndex + 1);
      }, 1500);
    }
  };

  const resetGame = () => {
    setGameState('ready');
    setCurrentCharacterIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setGameSession(null);
  };

  if (gameState === 'ready') {
    return (
      <Container>
        <GameArea>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#FF6B6B' }}>
            Ready to Learn Chinese? 准备好学中文了吗？
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#7F8C8D' }}>
            You'll learn {characters.length} characters in this session
          </p>
          <StartButton onClick={startGame}>
            Start Game 开始游戏
          </StartButton>
        </GameArea>
      </Container>
    );
  }

  if (gameState === 'completed') {
    return (
      <Container>
        <GameResults
          score={score}
          correctAnswers={correctAnswers}
          totalQuestions={totalQuestions}
          onPlayAgain={resetGame}
        />
      </Container>
    );
  }

  return (
    <Container>
      <GameHeader>
        <GameProgress
          current={currentCharacterIndex + 1}
          total={characters.length}
        />
        <Score>
          <ScoreValue>{score}</ScoreValue>
          <ScoreLabel>Score</ScoreLabel>
        </Score>
      </GameHeader>

      <GameArea>
        {characters[currentCharacterIndex] && (
          <CharacterCard
            key={characters[currentCharacterIndex].id}
            character={characters[currentCharacterIndex]}
            onAnswer={handleAnswer}
          />
        )}
      </GameArea>
    </Container>
  );
};

export default Game;