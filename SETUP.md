# Chinese Learning Game - Setup Guide

## 🚀 Quick Start for Developers

### 1. Clone and Install
```bash
git clone [your-repo-url]
cd chinese-learning-game
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values (see instructions below)
# Do NOT commit .env to git - it's in .gitignore
```

### 3. Get Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one)
3. Go to Project Settings → General → Your apps
4. Copy the config values to your `.env` file

### 4. Get Google OAuth Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (if you don't have one)
4. Copy the Client ID to your `.env` file

### 5. Run the Development Server
```bash
npm start
```

## 📋 Required Environment Variables

All variables are prefixed with `REACT_APP_` so they're available in the browser:

- `REACT_APP_FIREBASE_API_KEY`: Your Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN`: Usually `your-project-id.firebaseapp.com`
- `REACT_APP_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET`: Usually `your-project-id.firebasestorage.app`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID`: Your Firebase app ID
- `REACT_APP_GOOGLE_CLIENT_ID`: Google OAuth 2.0 client ID

## 🔒 Security Notes

- Never commit `.env` files to git
- Firebase API keys are safe to expose in client-side code (they're restricted by domain)
- Google OAuth client IDs are also safe to expose (they're public by design)
- Make sure your Firebase project has proper domain restrictions configured

## 🚀 Deployment

For production deployment, set these environment variables in your deployment platform:
- GitHub Actions: Use repository secrets
- Vercel: Use environment variables in dashboard
- Netlify: Use environment variables in site settings