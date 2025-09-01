import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useCloudUser as useUser } from '../../contexts/CloudUserContext';
import GoogleAuthButton from '../Auth/GoogleAuthButton';

const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.surface};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: ${props => props.theme.spacing.md} 0;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.sizes.xl};
  font-weight: 700;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.text.secondary};
  font-weight: ${props => props.$isActive ? 600 : 400};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.background};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: ${props => props.theme.sizes.sm};
  color: ${props => props.theme.colors.text.primary};
  font-weight: 600;
`;

const UserLevel = styled.span`
  font-size: ${props => props.theme.sizes.xs};
  color: ${props => props.theme.colors.text.secondary};
`;


const Header: React.FC = () => {
  const location = useLocation();
  const { user, isLoggedIn } = useUser();

  return (
    <HeaderContainer>
      <Nav>
        <Logo>学中文 Learn Chinese</Logo>
        <NavLinks>
          <NavLink to="/" $isActive={location.pathname === '/'}>
            Home
          </NavLink>
          <NavLink to="/game" $isActive={location.pathname === '/game'}>
            Play
          </NavLink>
          <NavLink to="/profile" $isActive={location.pathname === '/profile'}>
            Profile
          </NavLink>
        </NavLinks>
        
        <UserSection>
          {isLoggedIn && user && (
            <UserInfo>
              <UserName>{user.name}</UserName>
              <UserLevel>Level {user.level} • {user.experience} XP</UserLevel>
            </UserInfo>
          )}
          <GoogleAuthButton />
        </UserSection>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;