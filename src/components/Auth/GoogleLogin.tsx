import React from 'react';
import { GoogleLogin as GoogleOAuthLogin } from '@react-oauth/google';
import styled from 'styled-components';
import { useUser } from '../../contexts/UserContext';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin: ${props => props.theme.spacing.xl} auto;
  max-width: 400px;
`;

const Title = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  text-align: center;
`;

const GuestButton = styled.button`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text.primary};
  border: 2px solid ${props => props.theme.colors.text.light};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.sizes.md};
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: ${props => props.theme.spacing.md} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.text.light};
  }
  
  span {
    padding: 0 ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.text.secondary};
    font-size: ${props => props.theme.sizes.sm};
  }
`;

const GoogleLogin: React.FC = () => {
  const { login, isLoggedIn } = useUser();

  if (isLoggedIn) {
    return null; // Don't show login if already logged in
  }

  const handleGoogleSuccess = (credentialResponse: any) => {
    // In a real app, you would decode the JWT token to get user info
    // For now, we'll use a mock user profile
    
    try {
      // You would typically decode the JWT token here
      // const decodedToken = jwt_decode(credentialResponse.credential);
      
      // Mock user data for demonstration
      const userData = {
        id: 'google_' + Date.now(),
        name: 'Google User',
        email: 'user@gmail.com',
        avatar: undefined // Would come from Google profile
      };
      
      login(userData);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  const handleGuestLogin = () => {
    login({ name: '学习者' }); // Guest user with Chinese name
  };

  return (
    <LoginContainer>
      <Title>Login to Save Your Progress</Title>
      
      <GoogleOAuthLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        width="300"
        text="signin_with"
      />
      
      <OrDivider>
        <span>or</span>
      </OrDivider>
      
      <GuestButton onClick={handleGuestLogin}>
        Continue as Guest 继续作为游客
      </GuestButton>
    </LoginContainer>
  );
};

export default GoogleLogin;