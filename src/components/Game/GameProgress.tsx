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
`;

const ProgressText = styled.div`
  font-size: ${props => props.theme.sizes.md};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: 500;
`;

const ProgressBarContainer = styled.div`
  width: 200px;
  height: 8px;
  background: ${props => props.theme.colors.background};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
  border-radius: 4px;
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