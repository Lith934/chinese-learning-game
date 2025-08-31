import React from 'react';
import styled from 'styled-components';
import { useUser } from '../contexts/UserContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  padding: ${props => props.theme.spacing.xl};
  border-radius: 16px;
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto ${props => props.theme.spacing.md};
`;

const UserName = styled.h2`
  font-size: ${props => props.theme.sizes.xl};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const UserLevel = styled.p`
  font-size: ${props => props.theme.sizes.lg};
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.sizes.xxl};
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.text.secondary};
`;

const AchievementsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.xl};
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.sizes.lg};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Achievement = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
`;

const AchievementIcon = styled.div`
  font-size: ${props => props.theme.sizes.xl};
  margin-right: ${props => props.theme.spacing.md};
`;

const AchievementText = styled.div`
  flex: 1;
`;

const AchievementTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const AchievementDescription = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.sizes.sm};
`;

const Profile: React.FC = () => {
  const { user, achievements, userProgress } = useUser();

  if (!user) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Please start playing to create your profile!</h2>
        </div>
      </Container>
    );
  }

  const charactersLearned = userProgress.filter(p => p.mastered).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <Container>
      <ProfileHeader>
        <Avatar>👤</Avatar>
        <UserName>{user.name}</UserName>
        <UserLevel>Level {user.level}</UserLevel>
      </ProfileHeader>

      <StatsGrid>
        <StatCard>
          <StatValue>{user.experience}</StatValue>
          <StatLabel>Experience Points</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{user.totalScore.toLocaleString()}</StatValue>
          <StatLabel>Total Score</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{charactersLearned}</StatValue>
          <StatLabel>Characters Learned</StatLabel>
        </StatCard>
      </StatsGrid>

      <AchievementsSection>
        <SectionTitle>🏆 Achievements ({unlockedAchievements.length}/{achievements.length})</SectionTitle>
        {achievements.map(achievement => (
          <Achievement key={achievement.id} style={{ opacity: achievement.unlocked ? 1 : 0.5 }}>
            <AchievementIcon>{achievement.icon}</AchievementIcon>
            <AchievementText>
              <AchievementTitle>
                {achievement.unlocked ? '✅ ' : '🔒 '}{achievement.title}
              </AchievementTitle>
              <AchievementDescription>{achievement.description}</AchievementDescription>
            </AchievementText>
          </Achievement>
        ))}
      </AchievementsSection>
    </Container>
  );
};

export default Profile;