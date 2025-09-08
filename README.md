# RightCheck - Know Your Rights, Instantly

<div align="center">
  <img src="https://via.placeholder.com/200x200/2563eb/ffffff?text=RC" alt="RightCheck Logo" width="200" height="200">
  
  **A Base MiniApp providing on-demand legal checklists and emergency rights alerts**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Base Network](https://img.shields.io/badge/Network-Base-blue.svg)](https://base.org)
  [![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-blue.svg)](https://tailwindcss.com)
</div>

## 🌟 Overview

RightCheck is a mobile-first Base MiniApp that empowers users with instant access to legal rights information. Whether you're dealing with police interactions, landlord issues, workplace situations, or consumer fraud, RightCheck provides step-by-step guidance and essential rights information when you need it most.

### ✨ Key Features

- **🚔 On-Demand Legal Checklists**: Step-by-step guidance for police stops, landlord entry, job interviews, and more
- **📱 Emergency Rights Alerts**: Push notifications for new legislation and critical legal updates
- **🎯 Scenario-Based Guides**: Interactive modules for common life situations
- **📚 Legal Glossary**: Searchable database of legal terms and FAQs
- **🤖 AI Legal Assistant**: Conversational AI for instant legal Q&A
- **💰 Micro-transactions**: Pay small amounts for premium content using ETH on Base
- **🔗 Farcaster Integration**: Share legal knowledge with your social network
- **📱 Base MiniApp**: Seamless integration with Base wallet ecosystem

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Base wallet (for MiniApp features)

### Installation

```bash
# Clone the repository
git clone https://github.com/vistara-apps/-app-development-7331.git
cd -app-development-7331

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_NAME=RightCheck
VITE_FARCASTER_HUB_URL=https://hub-api.farcaster.xyz:2281
VITE_CHAT_AGENT_URL=https://api.base.org/chat-agents/v1
VITE_PAYMENT_URL=https://payments.vistara.dev
VITE_BASE_NETWORK=base
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Blockchain**: Base L2, Wagmi, RainbowKit
- **Payments**: X402 protocol for micro-transactions
- **Social**: Farcaster Hub API integration
- **AI**: Base Chat Agents for legal assistance
- **Deployment**: Docker, Nginx, Docker Compose

### Project Structure

```
src/
├── components/          # React components
│   ├── AppShell.jsx    # Main app layout
│   ├── ActionCard.jsx  # Content cards
│   ├── ChatAgent.jsx   # AI assistant
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useMiniKit.js   # Base MiniApp integration
│   ├── useFarcaster.js # Social features
│   ├── useChatAgent.js # AI assistant
│   └── ...
├── data/               # Mock data and constants
└── App.jsx            # Main application component
```

## 🎯 Core Features

### 1. Legal Checklists

Interactive step-by-step guides for common legal situations:

- **Police Traffic Stops**: Know your rights during police interactions
- **Landlord Entry**: Understand when landlords can enter your rental
- **Job Interviews**: Protect yourself from discriminatory questions
- **Consumer Fraud**: Steps to avoid and report scams

### 2. AI Legal Assistant

Conversational AI that helps users understand their rights:

```javascript
import { useChatAgent } from './hooks/useChatAgent';

const { sendMessage, chatHistory } = useChatAgent();

// Ask about legal rights
await sendMessage("What are my rights during a traffic stop?");
```

### 3. Base MiniApp Integration

Seamless integration with Base ecosystem:

```javascript
import { useMiniKit } from './hooks/useMiniKit';

const { isInMiniApp, saveFrame, shareContent } = useMiniKit();

// Save app for quick access
await saveFrame();

// Share legal content
await shareContent({
  title: "Police Stop Rights",
  text: "Essential rights during police interactions"
});
```

### 4. Micro-transactions

Pay small amounts for premium content:

```javascript
import { usePaymentContext } from './hooks/usePaymentContext';

const { createSession } = usePaymentContext();

// Purchase premium content for $0.001
await createSession("$0.001");
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Deployment
docker-compose up    # Run with Docker
npm run deploy       # Deploy to production
```

### Code Style

The project uses:
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling
- Conventional commits for git messages

### Testing

```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build and run production container
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f rightcheck-app
```

### Manual Deployment

```bash
# Build the application
npm run build

# Serve with nginx
cp -r dist/* /var/www/html/
systemctl restart nginx
```

## 🔌 API Integration

### Base MiniKit SDK

For Base MiniApp functionality:

```javascript
// Check if running in MiniApp
if (isInMiniApp) {
  // MiniApp specific features
  await saveFrame();
  await sendNotification({
    title: "Rights Alert",
    body: "New legal update available"
  });
}
```

### Farcaster Hub API

For social features:

```javascript
// Get user profile
const profile = await getUserProfile(fid);

// Share to Farcaster
const shareData = await shareLegalContent({
  title: "Legal Rights Guide",
  description: "Essential information for everyone"
});
```

### Payment Integration

Using X402 protocol:

```javascript
// Create payment session
const session = await createSession("$0.001");

// Handle payment success
onPaymentSuccess(() => {
  // Unlock premium content
  setPurchasedItems(prev => new Set([...prev, itemId]));
});
```

## 📱 Mobile Optimization

RightCheck is designed mobile-first with:

- **Responsive Design**: Works on all screen sizes
- **Touch-Friendly**: Large tap targets and gestures
- **Fast Loading**: Optimized assets and lazy loading
- **Offline Support**: Service worker for offline access
- **PWA Features**: Add to home screen capability

## 🔒 Security & Privacy

- **No Personal Data Storage**: Minimal data collection
- **Wallet Security**: Private keys never stored
- **HTTPS Only**: All communications encrypted
- **Content Validation**: Legal information reviewed
- **Rate Limiting**: Protection against abuse

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 Legal Disclaimer

**Important**: RightCheck provides general legal information, not legal advice. The information provided should not be used as a substitute for professional legal counsel. Laws vary by jurisdiction and change frequently. Users should consult with qualified attorneys for specific legal matters.

### Disclaimer Features

- Clear disclaimers throughout the app
- Encouragement to seek professional legal help
- Jurisdiction-specific warnings
- Emergency contact information

## 📞 Support

- **Documentation**: [docs.rightcheck.app](https://docs.rightcheck.app)
- **Email**: support@rightcheck.app
- **GitHub Issues**: [Report bugs or request features](https://github.com/vistara-apps/-app-development-7331/issues)
- **Community**: Join our Discord for discussions

## 📊 Roadmap

### Phase 1 (Current)
- ✅ Core legal checklists
- ✅ Base MiniApp integration
- ✅ Payment system
- ✅ AI assistant

### Phase 2 (Q2 2024)
- 🔄 Real-time legal alerts
- 🔄 Multi-language support
- 🔄 Advanced AI features
- 🔄 Community contributions

### Phase 3 (Q3 2024)
- 📋 Lawyer directory integration
- 📋 Document templates
- 📋 Legal case tracking
- 📋 Enterprise features

## 🏆 Acknowledgments

- **Base Team**: For the amazing L2 infrastructure
- **Farcaster**: For decentralized social protocols
- **Legal Experts**: For content review and validation
- **Open Source Community**: For the tools and libraries

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p><strong>Built with ❤️ for the Base ecosystem</strong></p>
  <p>
    <a href="https://base.org">Base</a> •
    <a href="https://farcaster.xyz">Farcaster</a> •
    <a href="https://rightcheck.app">RightCheck</a>
  </p>
</div>
