import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface GameResultsProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  onPlayAgain: () => void;
}

const Container = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  padding: ${props => props.theme.spacing.xxl};
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const Confetti = styled.div`
  font-size: 4rem;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Title = styled.h2`
  font-size: ${props => props.theme.sizes.xxl};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ScoreDisplay = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  padding: ${props => props.theme.spacing.xl};
  border-radius: 16px;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ScoreValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ScoreLabel = styled.div`
  font-size: ${props => props.theme.sizes.lg};
  opacity: 0.9;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatItem = styled.div`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.lg};
  border-radius: 12px;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.sizes.xl};
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const PlayAgainButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  font-size: ${props => props.theme.sizes.md};
  font-weight: 600;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const HomeButton = styled(Link)`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.sizes.md};
  font-weight: 600;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border: 2px solid ${props => props.theme.colors.text.light};
  border-radius: 25px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const GameResults: React.FC<GameResultsProps> = ({ 
  score, 
  correctAnswers, 
  totalQuestions, 
  onPlayAgain 
}) => {
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { emoji: '🎉', message: '出色! Excellent!' };
    if (accuracy >= 70) return { emoji: '👍', message: '很好! Great job!' };
    if (accuracy >= 50) return { emoji: '👌', message: '不错! Good work!' };
    return { emoji: '💪', message: '继续努力! Keep practicing!' };
  };

  const performance = getPerformanceMessage();

  return (
    <Container>
      <Confetti>{performance.emoji}</Confetti>
      <Title>{performance.message}</Title>
      
      <ScoreDisplay>
        <ScoreValue>{score}</ScoreValue>
        <ScoreLabel>Total Points</ScoreLabel>
      </ScoreDisplay>

      <StatsContainer>
        <StatItem>
          <StatValue>{correctAnswers}</StatValue>
          <StatLabel>Correct</StatLabel>
        </StatItem>
        
        <StatItem>
          <StatValue>{totalQuestions - correctAnswers}</StatValue>
          <StatLabel>Incorrect</StatLabel>
        </StatItem>
        
        <StatItem>
          <StatValue>{accuracy}%</StatValue>
          <StatLabel>Accuracy</StatLabel>
        </StatItem>
      </StatsContainer>

      <ButtonContainer>
        <PlayAgainButton onClick={onPlayAgain}>
          Play Again 再玩一次
        </PlayAgainButton>
        
        <HomeButton to="/">
          Home 主页
        </HomeButton>
      </ButtonContainer>
    </Container>
  );
};

export default GameResults;