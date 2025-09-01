import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface TransitionTimerProps {
  isActive: boolean;
  duration: number; // in milliseconds
  onComplete: () => void;
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const Container = styled.div<{ $isActive: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: ${props => props.$isActive ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: ${pulse} 1s infinite;
`;

const TimerText = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  text-align: center;
`;

const CircularProgress = styled.svg<{ $progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  
  circle {
    fill: none;
    stroke-width: 4;
    
    &.background {
      stroke: rgba(255, 255, 255, 0.2);
    }
    
    &.progress {
      stroke: #ff6b6b;
      stroke-linecap: round;
      stroke-dasharray: 283; /* 2 * π * 45 */
      stroke-dashoffset: ${props => 283 - (props.$progress * 283 / 100)};
      transition: stroke-dashoffset 0.1s linear;
    }
  }
`;

const TransitionTimer: React.FC<TransitionTimerProps> = ({ isActive, duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 100;
        if (newTime <= 0) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return newTime;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isActive, duration, onComplete]);
  
  const progress = ((duration - timeLeft) / duration) * 100;
  const secondsLeft = Math.ceil(timeLeft / 1000);
  
  return (
    <Container $isActive={isActive}>
      <CircularProgress $progress={progress} viewBox="0 0 100 100">
        <circle
          className="background"
          cx="50"
          cy="50"
          r="45"
        />
        <circle
          className="progress"
          cx="50"
          cy="50"
          r="45"
        />
      </CircularProgress>
      <TimerText>{secondsLeft}</TimerText>
    </Container>
  );
};

export default TransitionTimer;