import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { CloudUserProvider } from './contexts/CloudUserContext';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import Game from './pages/Game';
import Profile from './pages/Profile';

// Replace with your actual Google OAuth Client ID
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'demo-client-id';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <CloudUserProvider>
          <Router>
            <div className="App">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
            </div>
          </Router>
        </CloudUserProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
