import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import CharacterCard from '../components/Game/CharacterCard';
import GameProgress from '../components/Game/GameProgress';
import GameResults from '../components/Game/GameResults';
import LearningProgress from '../components/Game/LearningProgress';
import TransitionTimer from '../components/Game/TransitionTimer';
import { ChineseCharacter, GameSession } from '../types';
import { useCloudUser as useUser } from '../contexts/CloudUserContext';
import { CharacterService } from '../services/characterService';
import { audioService } from '../services/audioService';

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

const CHARACTERS_PER_SESSION = 10;

const Game: React.FC = () => {
  const { user, addExperience, updateProgress } = useUser();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed'>('ready');
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [characters, setCharacters] = useState<ChineseCharacter[]>([]);
  const [showTransitionTimer, setShowTransitionTimer] = useState(false);
  const currentGameSessionRef = useRef<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    // Characters will only load when user is authenticated
    // No auto-login needed since we use Google Auth
  }, []);

  useEffect(() => {
    // Only load characters when in ready state and user exists
    // This prevents characters from changing mid-game when user state updates
    if (user && gameState === 'ready' && characters.length === 0) {
      const selectedCharacters = CharacterService.selectCharactersForUser({
        userLevel: user.level,
        count: CHARACTERS_PER_SESSION
      });
      setCharacters(selectedCharacters);
    }
  }, [user, gameState, characters.length]);

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
    
    // Lock in the current session to prevent character changes
    currentGameSessionRef.current = session.id;
    setGameSession(session);
    setGameState('playing');
    setCurrentCharacterIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(characters.length);
  };

  const handleAnswer = async (isCorrect: boolean, points: number) => {
    const currentCharacter = characters[currentCharacterIndex];
    const newScore = score + (isCorrect ? points : 0);
    const newCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);
    
    setScore(newScore);
    setCorrectAnswers(newCorrectAnswers);
    
    // Auto-play sound for correct answers
    if (isCorrect) {
      try {
        await audioService.playPronunciation(currentCharacter.character, currentCharacter.pinyin);
      } catch (error) {
        console.warn('Could not play pronunciation:', error);
      }
    }
    
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

    // Move to next character or end game with timer
    if (currentCharacterIndex + 1 >= characters.length) {
      setTimeout(() => {
        setGameState('completed');
        if (gameSession) {
          setGameSession({
            ...gameSession,
            completedAt: new Date().toISOString(),
          });
        }
      }, 2000);
    } else {
      // Show transition timer after 2 seconds
      setTimeout(() => {
        setShowTransitionTimer(true);
      }, 2000);
    }
  };

  const handleTransitionComplete = () => {
    setShowTransitionTimer(false);
    setCurrentCharacterIndex(currentCharacterIndex + 1);
  };

  const resetGame = () => {
    // Clear the current session
    currentGameSessionRef.current = null;
    setGameState('ready');
    setCurrentCharacterIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setGameSession(null);
    setShowTransitionTimer(false);
    
    // Clear characters to trigger reload
    setCharacters([]);
  };

  if (!user) {
    return (
      <Container>
        <GameArea>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#FF6B6B' }}>
            Welcome to Chinese Learning! 欢迎学中文！
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#7F8C8D', marginBottom: '2rem', lineHeight: 1.6 }}>
            Please sign in with Google to start your Chinese learning journey and track your progress.
          </p>
          <p style={{ fontSize: '1rem', color: '#95A5A6', marginBottom: '2rem' }}>
            🎯 Personalized difficulty levels<br/>
            📊 Track your learning progress<br/>
            🏆 Unlock achievements<br/>
            💾 Save your game data
          </p>
          <div style={{ fontSize: '0.9rem', color: '#BDC3C7' }}>
            Click "Sign in with Google" in the header to get started!
          </div>
        </GameArea>
      </Container>
    );
  }

  if (gameState === 'ready') {
    const getDifficultyDescription = (level: number) => {
      if (level <= 5) return 'Basic characters (most common)';
      if (level <= 15) return 'Common characters (everyday use)';
      if (level <= 30) return 'Intermediate characters';
      return 'Advanced characters (challenging!)';
    };

    const maxDifficulty = user ? (
      user.level <= 5 ? 1 : 
      user.level <= 15 ? 2 : 
      user.level <= 30 ? 3 : 4
    ) : 1;

    return (
      <Container>
        <LearningProgress userLevel={user.level} />
        <GameArea>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#FF6B6B' }}>
            Ready to Learn Chinese? 准备好学中文了吗？
          </h2>
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '1.2rem', color: '#7F8C8D', marginBottom: '1rem' }}>
              Level {user.level} - {getDifficultyDescription(user.level)}
            </p>
            <p style={{ fontSize: '1rem', color: '#95A5A6', marginBottom: '1rem' }}>
              You'll practice {characters.length} characters up to difficulty level {maxDifficulty}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#BDC3C7' }}>
              {user.level <= 5 ? 
                "Starting with the most commonly used characters to build your foundation! 🌱" :
                user.level <= 15 ?
                "Great progress! Learning everyday characters now 📚" :
                user.level <= 30 ?
                "Getting challenging! You're doing amazing 💪" :
                "Expert level! These are truly advanced characters 🎯"
              }
            </p>
          </div>
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

      <GameArea style={{ opacity: showTransitionTimer ? 0.5 : 1, transition: 'opacity 0.3s ease' }}>
        {characters[currentCharacterIndex] && (
          <CharacterCard
            key={characters[currentCharacterIndex].id}
            character={characters[currentCharacterIndex]}
            onAnswer={handleAnswer}
          />
        )}
      </GameArea>
      
      <TransitionTimer
        isActive={showTransitionTimer}
        duration={3000}
        onComplete={handleTransitionComplete}
      />
    </Container>
  );
};

export default Game;