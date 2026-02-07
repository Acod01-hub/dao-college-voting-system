# 🗳️ VoteDAO - Decentralized College Voting System

A blockchain-based DAO voting platform for college elections built with React, Vite, and Tailwind CSS. Features secure wallet authentication, one-wallet-one-vote enforcement, and immutable on-chain vote recording.

![VoteDAO](https://img.shields.io/badge/Built%20with-React-61dafb?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind-38bdf8?style=for-the-badge&logo=tailwindcss)
![Web3](https://img.shields.io/badge/Web3-Enabled-ff6b6b?style=for-the-badge)

## ✨ Features

- 🔐 **MetaMask Wallet Integration** - Secure wallet-based authentication
- ✅ **Student Verification** - Mock email/student ID verification system
- 🗳️ **One-Wallet-One-Vote** - Blockchain-enforced voting integrity
- 📊 **Live Results** - Real-time vote counting with progress bars
- 🔍 **Audit Trail** - Complete transaction history with blockchain explorer links
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development

## 🎯 Demo Flow

1. **Landing Page** - Connect your MetaMask wallet
2. **Student Verification** - Verify eligibility with college email/ID
3. **Dashboard** - View election status and your voting eligibility
4. **Cast Vote** - Choose your candidate and confirm transaction
5. **Success** - Get your transaction hash for verification
6. **Results** - View live, immutable election results
7. **Audit Trail** - Explore all votes recorded on-chain

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dao-voting-system.git
cd dao-voting-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment.

## 🌐 Deploy to Vercel

### Option 1: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Vercel will auto-detect Vite and deploy

**Build Settings:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Blockchain:** Polygon Testnet (mocked for demo)
- **Web3 Library:** Ethers.js (integration ready)

## 📁 Project Structure

```
dao-voting-system/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind CSS imports
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── README.md           # This file
```

## 🎨 Features Breakdown

### Landing Page
- Eye-catching hero section with Web3 aesthetics
- Wallet connection button
- Quick access to results

### Student Verification
- Mock OTP/email verification flow
- Wallet eligibility marking
- Clear status feedback

### Voting Dashboard
- Status cards (Wallet, Verified, Vote Status)
- Active election information
- Quick navigation to voting and results

### Election Detail & Voting
- Candidate cards with positions and slogans
- Single-click voting with confirmation modal
- MetaMask transaction prompts
- Transaction hash generation

### Live Results
- Real-time vote counting
- Visual progress bars for each candidate
- Percentage breakdowns
- "On-chain & Immutable" labeling

### Audit Trail
- Transaction history table
- Blockchain explorer links
- Timestamp tracking
- Transparent verification

## 🔧 Customization

### Add Real Web3 Integration

Replace the mock Web3 functions in `App.jsx` with actual Ethers.js calls:

```javascript
import { ethers } from 'ethers';

const connectWallet = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  return address;
};
```

### Update Candidate Data

Modify the `candidates` array in `App.jsx`:

```javascript
const candidates = [
  { 
    id: 'candidate1', 
    name: 'Your Name', 
    position: 'President', 
    slogan: 'Your Slogan',
    color: '#6366f1' 
  },
  // ... more candidates
];
```

### Change Color Scheme

Update colors in `tailwind.config.js` or directly in component classes.

## 📝 License

MIT License - feel free to use this project for your hackathon or educational purposes!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👨‍💻 Author

Built for hackathons and educational demonstrations of DAO-based voting systems.

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Note:** This is a prototype built for demonstration purposes. The Web3 functionality is mocked for the demo. For production use, integrate with actual smart contracts and blockchain networks.
