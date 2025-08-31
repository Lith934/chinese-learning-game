import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xxl} ${props => props.theme.spacing.md};
  text-align: center;
`;

const Hero = styled.section`
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-family: ${props => props.theme.fonts.chinese};
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.sizes.xl};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const PlayButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  font-size: ${props => props.theme.sizes.lg};
  font-weight: 600;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xxl};
  border-radius: 50px;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 107, 107, 0.4);
  }
`;

const Features = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-top: ${props => props.theme.spacing.xxl};
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.xl};
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.sizes.lg};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
`;

const Home: React.FC = () => {
  return (
    <Container>
      <Hero>
        <Title>学中文 Learn Chinese</Title>
        <Subtitle>
          Master Chinese characters through interactive games and earn rewards!
        </Subtitle>
        <PlayButton to="/game">Start Learning 开始学习</PlayButton>
      </Hero>

      <Features>
        <FeatureCard>
          <FeatureIcon>汉</FeatureIcon>
          <FeatureTitle>Learn Characters</FeatureTitle>
          <FeatureDescription>
            Master Chinese characters with stroke order, meaning, and pronunciation
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🔊</FeatureIcon>
          <FeatureTitle>Pinyin & Audio</FeatureTitle>
          <FeatureDescription>
            Learn proper pronunciation with pinyin and native audio
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🎯</FeatureIcon>
          <FeatureTitle>Level Up</FeatureTitle>
          <FeatureDescription>
            Progress through levels and unlock new characters as you improve
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🏆</FeatureIcon>
          <FeatureTitle>Earn Rewards</FeatureTitle>
          <FeatureDescription>
            Collect achievements and track your learning journey
          </FeatureDescription>
        </FeatureCard>
      </Features>
    </Container>
  );
};

export default Home;