import React from 'react';
import styled from 'styled-components';

interface GameProgressProps {
  current: number;
  total: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  flex: 1;
  margin-right: ${props => props.theme.spacing.lg};
`;

const ProgressText = styled.div`
  font-size: ${props => props.theme.sizes.md};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: 500;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: ${props => props.theme.colors.background};
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  width: ${props => props.$progress}%;
  transition: width 0.5s ease;
  border-radius: 6px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const GameProgress: React.FC<GameProgressProps> = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <Container>
      <ProgressText>{current} / {total}</ProgressText>
      <ProgressBarContainer>
        <ProgressBar $progress={progress} />
      </ProgressBarContainer>
    </Container>
  );
};

export default GameProgress;