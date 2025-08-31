import React, { useState } from 'react';
import styled from 'styled-components';
import { ChineseCharacter } from '../../types';
import { audioService } from '../../services/audioService';

interface CharacterCardProps {
  character: ChineseCharacter;
  onAnswer: (isCorrect: boolean, points: number) => void;
}

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  padding: ${props => props.theme.spacing.xxl};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const CharacterContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const CharacterDisplay = styled.div`
  font-size: 6rem;
  font-family: ${props => props.theme.fonts.chinese};
  color: ${props => props.theme.colors.primary};
  text-align: center;
  user-select: none;
`;

const SpeakerButton = styled.button`
  background: ${props => props.theme.colors.accent};
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: ${props => props.theme.spacing.lg};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.primary};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const PinyinDisplay = styled.div<{ $show: boolean }>`
  font-size: ${props => props.theme.sizes.xl};
  color: ${props => props.theme.colors.secondary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  height: ${props => props.theme.sizes.xl};
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const Question = styled.h3`
  font-size: ${props => props.theme.sizes.lg};
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const OptionButton = styled.button<{ $isCorrect?: boolean; $isSelected?: boolean; $showResult?: boolean }>`
  background: ${props => {
    if (!props.$showResult) return props.theme.colors.background;
    if (props.$isCorrect) return props.theme.colors.success;
    if (props.$isSelected && !props.$isCorrect) return props.theme.colors.error;
    return props.theme.colors.background;
  }};
  color: ${props => {
    if (!props.$showResult) return props.theme.colors.text.primary;
    return 'white';
  }};
  border: 2px solid ${props => {
    if (!props.$showResult) return props.theme.colors.text.light;
    if (props.$isCorrect) return props.theme.colors.success;
    if (props.$isSelected && !props.$isCorrect) return props.theme.colors.error;
    return props.theme.colors.text.light;
  }};
  border-radius: 12px;
  padding: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.sizes.md};
  cursor: ${props => props.$showResult ? 'default' : 'pointer'};
  transition: all 0.2s ease;

  &:hover {
    ${props => !props.$showResult && `
      background: ${props.theme.colors.primary};
      color: white;
      border-color: ${props.theme.colors.primary};
    `}
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const HintButton = styled.button`
  background: none;
  border: 2px solid ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.accent};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.sizes.sm};
  cursor: pointer;
  margin: 0 auto;
  display: block;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.accent};
    color: white;
  }
`;

const Feedback = styled.div<{ $isCorrect: boolean }>`
  text-align: center;
  font-size: ${props => props.theme.sizes.lg};
  font-weight: 600;
  color: ${props => props.$isCorrect ? props.theme.colors.success : props.theme.colors.error};
  margin-top: ${props => props.theme.spacing.lg};
`;

// Generate options outside component to avoid recreation on every render
const generateOptions = (characterMeaning: string): string[] => {
  const wrongOptions = [
    'hello', 'goodbye', 'thank you', 'water', 'fire', 'earth', 'big', 'small',
    'beautiful', 'ugly', 'fast', 'slow', 'happy', 'sad', 'love', 'hate'
  ].filter(option => option !== characterMeaning);
  
  const randomWrongOptions = wrongOptions
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  const allOptions = [characterMeaning, ...randomWrongOptions]
    .sort(() => Math.random() - 0.5);
  
  return allOptions;
};

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showPinyin, setShowPinyin] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [options] = useState(() => generateOptions(character.meaning));

  const handleOptionClick = (option: string) => {
    if (showResult) return;

    const isCorrect = option === character.meaning;
    setSelectedOption(option);
    setShowResult(true);
    setShowPinyin(true);

    // Calculate points based on difficulty and if hint was used
    const basePoints = character.difficulty * 100;
    const hintPenalty = showPinyin ? 0.5 : 1;
    const points = Math.round(basePoints * hintPenalty);

    setTimeout(() => {
      onAnswer(isCorrect, isCorrect ? points : 0);
    }, 2000);
  };

  const handleShowHint = () => {
    setShowPinyin(true);
  };

  const handlePlayPronunciation = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      await audioService.playPronunciation(character.character, character.pinyin);
    } catch (error) {
      console.warn('Could not play pronunciation:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <Card>
      <CharacterContainer>
        <CharacterDisplay>{character.character}</CharacterDisplay>
        <SpeakerButton 
          onClick={handlePlayPronunciation}
          disabled={isPlaying}
          title="Play pronunciation"
        >
          {isPlaying ? '⏸' : '🔊'}
        </SpeakerButton>
      </CharacterContainer>
      <PinyinDisplay $show={showPinyin}>{character.pinyin}</PinyinDisplay>
      
      <Question>What does this character mean?</Question>
      
      <OptionsContainer>
        {options.map((option, index) => (
          <OptionButton
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={showResult}
            $isCorrect={option === character.meaning}
            $isSelected={selectedOption === option}
            $showResult={showResult}
          >
            {option}
          </OptionButton>
        ))}
      </OptionsContainer>

      {!showPinyin && !showResult && (
        <HintButton onClick={handleShowHint}>
          Show Pinyin Hint 显示拼音提示
        </HintButton>
      )}

      {showResult && (
        <Feedback $isCorrect={selectedOption === character.meaning}>
          {selectedOption === character.meaning ? '正确! Correct!' : `错误! Wrong! The answer is "${character.meaning}"`}
        </Feedback>
      )}
    </Card>
  );
};

export default CharacterCard;