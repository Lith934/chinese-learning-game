import React from 'react';
import styled from 'styled-components';
import { CharacterService } from '../../services/characterService';

const ProgressCard = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ProgressHeader = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.sizes.lg};
`;

const Description = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.md};
  line-height: 1.5;
`;

const FocusList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FocusItem = styled.li`
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.xs} 0;
  
  &:before {
    content: '📝';
    margin-right: ${props => props.theme.spacing.sm};
  }
`;

const Milestone = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}20, ${props => props.theme.colors.secondary}20);
  padding: ${props => props.theme.spacing.md};
  border-radius: 8px;
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const MilestoneText = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
  font-weight: 500;
  
  &:before {
    content: '🎯 ';
  }
`;

interface LearningProgressProps {
  userLevel: number;
}

const LearningProgress: React.FC<LearningProgressProps> = ({ userLevel }) => {
  const recommendations = CharacterService.getLearningRecommendations(userLevel);

  return (
    <ProgressCard>
      <ProgressHeader>Your Learning Journey - Level {userLevel}</ProgressHeader>
      
      <Description>{recommendations.description}</Description>
      
      <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#FF6B6B' }}>Focus Areas:</h4>
      <FocusList>
        {recommendations.focus.map((focus, index) => (
          <FocusItem key={index}>{focus}</FocusItem>
        ))}
      </FocusList>
      
      <Milestone>
        <MilestoneText>{recommendations.nextMilestone}</MilestoneText>
      </Milestone>
    </ProgressCard>
  );
};

export default LearningProgress;