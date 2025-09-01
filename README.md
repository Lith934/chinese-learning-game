# 学中文 Learn Chinese Game

A fun, interactive web application for kids to learn Chinese characters through gamification. Features character recognition, pinyin pronunciation, leveling system, and achievements.

## 🎮 Features

- **Interactive Character Learning**: Learn Chinese characters with meanings and pronunciation
- **Pinyin Support**: Audio pronunciation with native text-to-speech
- **Progressive Difficulty**: Characters organized by difficulty levels
- **Gamification**: Points, levels, and achievement system
- **User Progress Tracking**: Track learning progress and mastered characters
- **Google OAuth Authentication**: Secure login with Google account
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

### Frontend
- **React 19** with TypeScript
- **Styled Components** for styling
- **React Router** for navigation
- **Context API** for state management
- **Google OAuth** for authentication

### Backend
- **Firebase Firestore** for cloud database
- **Google OAuth** for authentication
- **Firebase Security Rules** for access control

### DevOps
- **Docker** for containerization
- **GitHub Actions** for CI/CD
- **GitHub Pages** for frontend deployment
- **AWS** for backend infrastructure

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase project (free)
- Google OAuth credentials

### Setup

```bash
# Clone and install
git clone [your-repo-url]
cd chinese-learning-game
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Firebase config (see SETUP.md)

# Start development server
npm start

# Build for production
npm run build
```

The app will be available at `http://localhost:3000`

📋 **See [SETUP.md](SETUP.md) for detailed configuration instructions**

### Docker Deployment

```bash
# Build Docker image
docker build -t chinese-learning-game .

# Run container
docker run -p 8080:80 chinese-learning-game
```

### Backend Setup

1. **Setup AWS Infrastructure**:
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

2. **Deploy Lambda Functions**:
```bash
cd lambda
npm install
npm run build
# Deploy using your preferred method (Serverless Framework, SAM, etc.)
```

## 🎯 Game Features

### Learning System
- **Character Recognition**: Multiple choice questions for Chinese characters
- **Difficulty Progression**: 5 levels of difficulty (1-5)
- **Categories**: Characters organized by type (pronouns, verbs, adjectives, etc.)
- **Audio Support**: Native browser text-to-speech for pronunciation

### Gamification
- **Experience Points**: Earn XP for correct answers
- **Leveling System**: Progress through levels (1000 XP per level)
- **Achievements**: Unlock achievements for milestones
- **Progress Tracking**: Track attempts, correct answers, and mastered characters

### User Interface
- **Clean Design**: Kid-friendly, colorful interface
- **Responsive Layout**: Works on all screen sizes
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimized for fast loading

## 🔧 Configuration

### Environment Variables

Create `.env` file (copy from `.env.example`):
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

**⚠️ Never commit `.env` to git - it's in `.gitignore`**

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized domains (your domain and localhost for development)
6. Copy the Client ID to your environment variables

## 📱 API Endpoints

### Users
- `POST /users` - Create new user
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user data

### Characters
- `GET /characters` - Get characters (with filtering by level/category)
- `GET /characters/{id}` - Get specific character

### User Progress
- `GET /progress/{userId}` - Get user progress
- `POST /progress` - Update user progress

### Game Sessions
- `POST /sessions` - Create game session
- `PUT /sessions/{id}` - Update game session

## 🏆 Achievement System

### Available Achievements
- **First Steps** 👶: Learn your first 10 characters
- **Perfect Score** 🎯: Get 100% accuracy in a game session
- **Hot Streak** 🔥: Maintain a 7-day learning streak
- **Scholar** 🎓: Learn 50 characters
- **Master** 🏆: Learn 100 characters
- **Speed Learner** ⚡: Complete a session in under 2 minutes

## 🚀 Deployment

### Frontend (GitHub Pages)

The project is configured with GitHub Actions for automatic deployment to GitHub Pages:

1. Push to `main` branch
2. GitHub Actions builds and deploys automatically
3. Available at `https://yourusername.github.io/chinese-learning-game`

### Backend (AWS)

1. **Setup AWS Infrastructure**:
```bash
cd terraform
terraform init
terraform apply
```

2. **Deploy Lambda Functions**:
Use AWS SAM, Serverless Framework, or direct deployment

3. **Update Frontend Configuration**:
Update `REACT_APP_API_BASE_URL` with your API Gateway URL

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run with coverage
npm test -- --coverage

# Run backend tests
cd lambda
npm test
```

## 📊 Monitoring

### AWS CloudWatch
- Lambda function logs and metrics
- DynamoDB performance metrics
- API Gateway request/response logs

### Frontend Analytics
- User engagement tracking
- Performance monitoring
- Error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chinese character data and pronunciations
- React and AWS communities
- Contributors and testers

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Happy Learning! 学习愉快！** 🎉
