// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Security: Domain validation
const allowedDomains = [
  'localhost',
  '127.0.0.1',
  // GitHub Pages domain - update with your actual GitHub username
  'simondai.github.io',
  // Add custom domain if you set one up later
  // 'your-custom-domain.com'
];

const currentDomain = window.location.hostname;
const isDomainAllowed = allowedDomains.includes(currentDomain);

if (!isDomainAllowed && process.env.NODE_ENV === 'production') {
  console.error('🚫 Unauthorized domain access blocked:', currentDomain);
  throw new Error('Access denied: Unauthorized domain');
}

// Validate required environment variables
const requiredEnvVars = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => `REACT_APP_FIREBASE_${key.toUpperCase().replace(/([A-Z])/g, '_$1')}`);

if (missingVars.length > 0) {
  const errorMsg = `❌ Missing environment variables: ${missingVars.join(', ')}\n\n` +
    `📋 To fix this:\n` +
    `1. Copy .env.example to .env: cp .env.example .env\n` +
    `2. Fill in your Firebase config values in .env\n` +
    `3. See SETUP.md for detailed instructions`;
  
  console.error(errorMsg);
  throw new Error('Missing Firebase configuration');
}

// Your Firebase config - loaded from environment variables
const firebaseConfig = requiredEnvVars;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;