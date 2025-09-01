import React from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useCloudUser as useUser } from '../../contexts/CloudUserContext';

interface GoogleUserInfo {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

const AuthButton = styled.button<{ $isLogout?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.$isLogout ? props.theme.colors.error : '#4285f4'};
  border-radius: 8px;
  background: ${props => props.$isLogout ? 'transparent' : '#4285f4'};
  color: ${props => props.$isLogout ? props.theme.colors.error : 'white'};
  cursor: pointer;
  font-size: ${props => props.theme.sizes.sm};
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$isLogout ? props.theme.colors.error : '#357ae8'};
    color: ${props => props.$isLogout ? 'white' : 'white'};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const GoogleIcon = styled.div`
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

const GoogleAuthButton: React.FC = () => {
  const { user, loginWithGoogle, logout, isLoggedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: 'application/json'
            }
          }
        );
        
        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info');
        }
        
        const userInfo: GoogleUserInfo = await userInfoResponse.json();
        
        // Login with Google user info
        await loginWithGoogle({
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatar: userInfo.picture
        }, tokenResponse.access_token);

        // Redirect to game page after successful login
        // But don't redirect if already on game page to avoid loops
        if (location.pathname !== '/game') {
          navigate('/game');
        }
        
      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      alert('Google login failed. Please try again.');
    }
  });

  const handleLogout = () => {
    googleLogout();
    logout();
  };

  if (isLoggedIn && user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user.avatar && <UserAvatar src={user.avatar} alt={user.name} />}
          <span style={{ fontSize: '14px', color: '#666' }}>
            {user.name}
          </span>
        </div>
        <AuthButton $isLogout onClick={handleLogout}>
          Sign Out
        </AuthButton>
      </div>
    );
  }

  return (
    <AuthButton onClick={() => googleLogin()}>
      <GoogleIcon>G</GoogleIcon>
      Sign in with Google
    </AuthButton>
  );
};

export default GoogleAuthButton;