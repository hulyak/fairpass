# FairPass - Decentralized Creator Membership Platform

**Radically fair, radically creator-first**

A Web3 membership protocol built on Polkadot that enables creators to monetize directly with 0% platform fees through NFT-based memberships.

---

## Project Overview

FairPass is a decentralized membership platform built on Polkadot that empowers creators to monetize their content directly, without platform fees. Unlike traditional platforms (Patreon, Substack) that take 5-20% cuts, FairPass enables creators to keep 100% of their earnings through blockchain technology and NFT-based memberships.

### The Problem
- **High Platform Fees**: Traditional platforms charge 5-20% on creator earnings
- **No Ownership**: Creators don't own their audience data or relationships
- **No Liquidity**: Fans can't resell or trade their memberships
- **Platform Lock-in**: Creators are dependent on centralized platforms

### Our Solution
- **Zero Platform Fees** - Creators receive 100% of membership payments
- **NFT Memberships** - Tradeable, verifiable membership tokens on Polkadot
- **True Ownership** - Creators own their data, fans own their memberships
- **Secondary Market** - Fans can resell memberships, creating liquidity and new revenue streams
- **Built on Polkadot** - Uses Web3 infrastructure for transparency, security, and fairness

---

## 🚀 Key Features

### For Creators
- **Creator Dashboard** - Manage membership tiers, track subscribers, view analytics
- **Flexible Tiers** - Create custom membership levels with different prices and durations
- **Direct Payments** - Receive WND (Westend tokens) directly to your wallet, no intermediaries
- **Royalties** - Earn from secondary sales when fans trade memberships
- **Profile Management** - Showcase your work and build your brand
- **Time-bound Memberships** - Automatic expiration based on blockchain timestamps

### For Fans
- **Marketplace** - Browse and purchase memberships from all creators
- **NFT Ownership** - Your membership is a tradeable NFT asset
- **Secondary Market** - Buy discounted memberships or sell yours when needed
- **Transaction History** - Complete transparency of all purchases on-chain
- **My Memberships** - Manage all your active subscriptions in one place
- **Wallet Integration** - Seamless connection with Polkadot.js and SubWallet

### Technical Highlights
- **Real Polkadot Integration** - Connects to Westend Asset Hub (system parachain)
- **Multi-Wallet Support** - Polkadot.js extension, SubWallet, and Talisman
- **On-chain Payments** - Real WND transfers for purchases
- **NFTs Pallet Integration** - Uses the modern `nfts` pallet 
- **On-chain Metadata** - NFT metadata stored directly on Westend Asset Hub
- **Supabase Backend** - PostgreSQL database with Row Level Security
- **Demo Mode** - Full simulation for testing without blockchain transactions
- **Verifiable Ownership** - All memberships are blockchain-verified assets

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript - Type-safe component development
- **Vite** - Fast build tool and HMR
- **Tailwind CSS** - Modern, responsive utility-first CSS
- **Lucide Icons** - Consistent icon system

### Blockchain
- **Polkadot.js API** (`@polkadot/api`) - Core blockchain interaction
- **@polkadot/extension-dapp** - Wallet connection and signing
- **@polkadot/util** - Cryptographic utilities and formatting
- **Westend Asset Hub** - Polkadot system parachain with NFTs pallet
- **NFTs Pallet** - Modern Substrate pallet for NFT operations

### Backend
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Relational database for creator profiles, tiers, memberships
- **Row Level Security** - Database-level access control

### Development Tools
- **ESLint** - Code linting and quality
- **TypeScript** - Static type checking
- **Vite Plugin React** - Fast Refresh and optimizations

---

## ⚡ Quick Demo (5 Minutes)

### Option 1: Demo Mode (No Setup Required)
```bash
npm install
npm run dev
```
1. Click "Connect Wallet" → "Use Demo Mode"
2. Navigate to "For Creators" → Create profile
3. Create a membership tier
4. Go to "Marketplace" → Purchase your tier
5. View in "My Memberships"

**Note**: Demo mode simulates all transactions for instant testing without blockchain setup.

### Option 2: Real Blockchain (10 Minutes)
**Prerequisites**: Polkadot.js extension + Westend testnet WND tokens
1. Get tokens from https://faucet.polkadot.io/westend?parachain=1000
2. Connect wallet (Real Mode)
3. Create profile and membership tier
4. Purchase membership → **Real NFT minted on Westend Asset Hub**
5. Verify on-chain (see Verification section below)

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js 18+** and npm
- **Polkadot Wallet**: Polkadot Developer Signer (formerly Polkadot.js extension), SubWallet, or Talisman
- Modern web browser (Chrome, Firefox, Brave)

### Quick Start (5 minutes)

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/fairpass.git
cd fairpass
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Setup
The project includes a `.env` file with Supabase credentials pre-configured:
```env
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

No additional configuration needed for development.

#### 4. Install Wallet Extension

**Option A: Polkadot Developer Signer (Recommended)**
- Formerly known as "Polkadot.js extension"
- **Chrome**: https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd
- **Firefox**: https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/

**Option B: SubWallet**
- Download: https://subwallet.app/download.html
- See [SUBWALLET_SETUP.md](./SUBWALLET_SETUP.md) for Westend Asset Hub configuration

**Option C: Talisman**
- Download: https://talisman.xyz/

#### 5. Run Development Server
```bash
npm run dev
```

The app will open at **http://localhost:5173**

#### 6. Choose Your Testing Mode

**Option A: Demo Mode (Fastest - No Setup)**
- Click "Connect Wallet" → "Use Demo Mode"
- Simulated 100 WND balance
- All features work without blockchain
- Good for testing UI/UX

**Option B: Real Mode (Actual Blockchain)**
- See [QUICK_TEST.md](./QUICK_TEST.md) for 1-minute setup
- Get test tokens: https://faucet.polkadot.io/westend?parachain=1000
- Real NFT minting on Westend Asset Hub

---

## 🧪 Testing Instructions

### Demo Mode (No Blockchain Required)

1. **Connect in Demo Mode**:
   - Click "Connect Wallet"
   - Click "Use Demo Mode" button
   - ✅ Instant connection with simulated 100 WND balance

2. **Test All Features**:
   - ✅ Create creator profile
   - ✅ Create membership tiers
   - ✅ Mint NFTs (simulated)
   - ✅ Transfer memberships (simulated)
   - ✅ All transactions are fake but realistic

3. **Use Cases**:
   - UI/UX testing
   - Demo presentations
   - Development without blockchain dependencies

### Real Mode (Westend Asset Hub)

#### Quick Setup (1 Minute)

1. **Install Polkadot.js Extension** (see Prerequisites)

2. **Get Test Tokens**:
   - Direct Asset Hub Faucet: https://faucet.polkadot.io/westend?parachain=1000
   - Enter your wallet address
   - Complete captcha
   - Receive **100 WND on Asset Hub** instantly

3. **Connect to FairPass**:
   - Click "Connect Wallet"
   - Approve connection in extension
   - Balance should show ~100 WND

#### Detailed Setup Guides

- **[QUICK_TEST.md](./QUICK_TEST.md)** - 1-minute quickstart
- **[WESTEND_SETUP.md](./WESTEND_SETUP.md)** - Understanding Asset Hub vs Relay Chain
- **[SUBWALLET_SETUP.md](./SUBWALLET_SETUP.md)** - SubWallet-specific configuration

#### Network Details
- **Network**: Westend Asset Hub (System Parachain 1000)
- **RPC Endpoint**: `wss://westend-asset-hub-rpc.polkadot.io`
- **Token**: WND (Westend DOT)
- **NFTs Pallet**: Available on Asset Hub (not Relay Chain)

---

## 🔍 Verification

### Verify NFT Ownership On-Chain

After purchasing a membership, you can verify the NFT exists on Westend Asset Hub:

1. **Via Polkadot.js Apps**:
   - Go to https://polkadot.js.org/apps/?rpc=wss://westend-asset-hub-rpc.polkadot.io#/chainstate
   - Select `nfts` pallet → `item(u32, u32)`
   - Enter your collection ID and item ID (displayed after purchase)
   - Query to see owner address, metadata, and details

2. **Via Transaction Explorer**:
   - Copy transaction hash from the purchase confirmation
   - Visit https://westend.subscan.io/
   - Paste hash to see on-chain confirmation and block details

3. **Via Your Wallet**:
   - Open Polkadot.js extension or SubWallet
   - View NFT in your account's assets/collectibles section
   - Confirm ownership and metadata

---

## 🎮 Usage Guide

### For Creators

1. **Create Your Profile**:
   - Navigate to **Creator Dashboard**
   - Click **"Create Your Profile"**
   - Enter name, bio, and avatar URL
   - Click **"Save Profile"**

2. **Create Membership Tiers**:
   - Click **"Create New Tier"**
   - Set tier name (e.g., "Bronze", "Gold", "Platinum")
   - Set price in WND (e.g., 10 WND)
   - Set duration in days (e.g., 30 days)
   - Add benefits description
   - Optionally set max supply and royalty %
   - Click **"Create Tier"**

3. **Manage Subscribers**:
   - View active memberships in dashboard
   - Track revenue and subscriber count
   - Monitor tier performance

4. **Share Your Page**:
   - Copy your creator profile URL
   - Share on social media
   - Fans can purchase directly from your page

### For Fans

1. **Browse Marketplace**:
   - Navigate to **Marketplace**
   - Use filters (price, duration, creator)
   - Discover creators and their tiers

2. **Purchase Membership**:
   - Click on any tier card
   - Review benefits and price
   - Click **"Purchase Membership"**
   - Approve transaction in wallet
   - NFT is minted to your wallet

3. **View Your Memberships**:
   - Navigate to **My Memberships**
   - See all active and expired memberships
   - Check expiration dates
   - View transaction history

4. **Secondary Market**:
   - List memberships for resale
   - Buy discounted memberships from others
   - Creators earn royalties on secondary sales

---

## 🏗️ Project Structure

```
fairpass/
├── src/
│   ├── components/           # React components
│   │   ├── WalletConnect.tsx # Wallet connection modal
│   │   ├── Navigation.tsx    # Top navigation bar
│   │   └── ...
│   ├── contexts/             # React Context providers
│   │   └── WalletContext.tsx # Wallet state management
│   ├── lib/                  # Utility libraries
│   │   └── polkadot.ts       # Polkadot.js integration (NFTs pallet)
│   ├── pages/                # Route pages
│   │   ├── CreatorDashboard.tsx
│   │   ├── Marketplace.tsx
│   │   ├── MyMemberships.tsx
│   │   └── ...
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── fairpass-docs/            # Documentation
│   ├── DEMO_VIDEO_SCRIPT.md  # Video demo script
│   ├── POLKADOT_DEVEX_FEEDBACK.md
│   ├── HACKATHON_ANSWERS.md
│   ├── NFT_INTEGRATION.md
│   └── ...
├── public/                   # Static assets
├── supabase/                 # Supabase schema and config
├── WESTEND_SETUP.md          # Westend Asset Hub setup guide
├── SUBWALLET_SETUP.md        # SubWallet configuration guide
├── QUICK_TEST.md             # Quick testing guide
├── .env                      # Environment variables
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
└── README.md                 # This file
```

---

## 📚 Dependencies

### Core Dependencies
```json
{
  "@polkadot/api": "^16.5.2",
  "@polkadot/api-contract": "^16.5.2",
  "@polkadot/extension-dapp": "^0.62.3",
  "@polkadot/util": "^13.5.8",
  "@polkadot/util-crypto": "^13.5.8",
  "@supabase/supabase-js": "^2.57.4",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "lucide-react": "^0.344.0"
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^4.3.1",
  "@types/react": "^18.3.5",
  "@types/react-dom": "^18.3.0",
  "typescript": "^5.5.3",
  "vite": "^5.4.2",
  "tailwindcss": "^3.4.1",
  "autoprefixer": "^10.4.18",
  "postcss": "^8.4.35",
  "eslint": "^9.9.1",
  "typescript-eslint": "^8.3.0"
}
```

### Install All
```bash
npm install
```

## 🔧 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

Build output will be in `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### Deploy
The app can be deployed to any static hosting service:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag `dist/` folder to Netlify
- **GitHub Pages**: Push `dist/` to `gh-pages` branch
- **IPFS**: Upload `dist/` to IPFS for decentralized hosting

---

## 🚧 Current Status & Roadmap

### ✅ Completed
- Full UI/UX implementation with Tailwind CSS
- Real Polkadot wallet connection (Polkadot.js, SubWallet, Talisman)
- Westend Asset Hub integration
- Real WND transfers for payments
- Real NFT minting with NFTs pallet (migrated from deprecated Uniques)
- On-chain metadata storage
- Complete database architecture with Supabase
- Demo mode for testing without blockchain
- Transaction history tracking
- Creator profiles and membership tiers
- Marketplace with filters
- My Memberships dashboard
- Secondary marketplace with listing, purchasing, and royalty calculation

### 🔮 Future Roadmap

**Phase 1: Enhancements**
- [ ] IPFS integration for images and rich metadata
- [ ] Secondary market smart contract
- [ ] Creator royalties on resales
- [ ] NFT gallery view
- [ ] Advanced filtering and search

**Phase 2: Production**
- [ ] Mainnet deployment (Polkadot/Kusama)
- [ ] Multi-chain support (parachains)
- [ ] Mobile wallet support (Nova, Fearless)
- [ ] Content delivery integration
- [ ] Mobile apps (iOS/Android)

**Phase 3: Scale**
- [ ] Decentralized governance (DAO)
- [ ] Creator verification system
- [ ] Discovery algorithms
- [ ] API for third-party integrations
- [ ] Cross-chain bridges

---

## 🐛 Troubleshooting

### "Balance shows 0 after using faucet"
**Solution**: You likely used the Relay Chain faucet instead of Asset Hub faucet.
- Use the direct Asset Hub faucet: https://faucet.polkadot.io/westend?parachain=1000
- See [WESTEND_SETUP.md](./WESTEND_SETUP.md) for details on Relay Chain vs Asset Hub

### "Metadata update required" error (SubWallet)
**Solution**: SubWallet needs to update network metadata.
- See [SUBWALLET_SETUP.md](./SUBWALLET_SETUP.md) for step-by-step fix
- Method 1: Update via Polkadot.js Apps → Settings → Metadata
- Method 2: Toggle Westend Asset Hub OFF/ON in SubWallet
- Method 3: Reload SubWallet extension

### "Cannot connect to RPC endpoint"
**Solutions**:
- Check internet connection
- Disable VPN/firewall temporarily
- Alternative RPC: `wss://westend-asset-hub-rpc.dwellir.com`
- Try demo mode to test app without blockchain

### "Transaction fails"
**Common causes**:
- Insufficient balance (need at least 2-5 WND for NFT operations)
- Wrong network (must be Asset Hub, not Relay Chain)
- Wallet approval cancelled

### "MetaMask extension not found" error
**Why this happens**: If you have MetaMask installed, it tries to auto-inject on all pages, even though FairPass uses Polkadot wallets.

**Solution**: This error is harmless and suppressed automatically. FairPass only uses Polkadot wallets (Polkadot.js, SubWallet, Talisman), not MetaMask. You can safely ignore this or disable MetaMask extension while using FairPass.

### Other Issues
- Check browser console (F12) for detailed error messages
- Try demo mode to isolate if issue is blockchain-related
- Refer to documentation in `fairpass-docs/` folder and setup guides

---

## 🎯 Hackathon Context

This project was built for the **Polkadot Hackathon** with the following goals:

1. **Demonstrate Real Polkadot Integration**: Using Westend Asset Hub, NFTs pallet, and Polkadot.js API
2. **Solve a Real Problem**: 0% platform fees for creator economy
3. **Showcase Web3 Benefits**: True ownership, secondary markets, transparency
4. **Provide Developer Value**: Clear documentation and feedback on Polkadot DX

### Key Achievements
- ✅ Real blockchain integration (not just mockups)
- ✅ NFT minting on Westend Asset Hub
- ✅ On-chain payments and transfers
- ✅ Multi-wallet support (Polkadot.js, SubWallet, Talisman)
- ✅ Demo mode for easy testing
- ✅ Comprehensive documentation
- ✅ Developer experience feedback

### 💡 Key Differentiators

What makes FairPass stand out:

1. **Real Problem, Real Solution**
   - Addresses the $100B+ creator economy with 5-20% platform fees
   - Working prototype with actual blockchain transactions
   - Not a proof-of-concept—production-ready foundation

2. **Technical Excellence**
   - Real NFT minting using Polkadot's NFTs pallet (migrated from deprecated Uniques)
   - On-chain verification of all memberships
   - Hybrid architecture: Web2 performance + Web3 ownership guarantees
   - Clean, type-safe TypeScript codebase

3. **Polkadot-Native**
   - Built specifically for Polkadot ecosystem
   - Uses Westend Asset Hub system parachain
   - Showcases NFTs pallet capabilities
   - Ready for mainnet/parachain deployment

4. **User-Centric Design**
   - Demo mode for instant testing (no crypto knowledge required)
   - Smooth UX matching Web2 platforms (Patreon-like experience)
   - Multi-wallet support with clear installation guidance
   - Comprehensive error handling and user feedback

5. **Open & Transparent**
   - Fully open-source with extensive documentation
   - Developer experience feedback included
   - Easy to test and verify (60 seconds demo, 5 minutes real blockchain)
   - Secondary marketplace with tradeable memberships



