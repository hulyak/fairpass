# FairPass - Decentralized Creator Membership Platform

Radically fair, radically creator-first

## 🎯 Project Overview

FairPass is a decentralized membership platform built on Polkadot that empowers creators to monetize their content directly, without platform fees. Unlike traditional platforms (Patreon) that take 5-20% cuts, FairPass enables creators to keep 100% of their earnings through blockchain technology and NFT-based memberships.

### The Problem
- Traditional platforms charge 5-20% fees on creator earnings
- Creators don't own their audience data
- Fans can't resell or trade their memberships
- Platform lock-in prevents creator freedom

### Our Solution
- **Zero Platform Fees** - Creators receive 100% of membership payments
- **NFT Memberships** - Tradeable, verifiable membership tokens
- **True Ownership** - Creators own their data, fans own their memberships
- **Secondary Market** - Fans can resell memberships, creating new revenue streams
- **Built on Polkadot** - Leveraging Web3 infrastructure for transparency and fairness

## 🚀 Key Features

### For Creators
- **Creator Dashboard** - Manage membership tiers, track subscribers, view analytics
- **Flexible Tiers** - Create custom membership levels with different prices and durations
- **Direct Payments** - Receive DOT directly to your wallet, no intermediaries
- **Royalties** - Earn from secondary sales when fans trade memberships
- **Profile Management** - Showcase your work and build your brand

### For Fans
- **Marketplace** - Browse and purchase memberships from all creators
- **NFT Ownership** - Your membership is a tradeable NFT asset
- **Secondary Market** - Buy discounted memberships or sell yours
- **Transaction History** - Complete transparency of all purchases
- **My Memberships** - Manage all your active subscriptions in one place

### Technical Highlights
- **Real Polkadot Integration** - Connects to Westend testnet
- **Wallet Support** - Polkadot.js extension integration
- **On-chain Payments** - Real DOT transfers for purchases
- **Real NFT Minting** - Uses Polkadot Uniques pallet for on-chain NFTs
- **Supabase Backend** - Decentralized data storage with PostgreSQL
- **Verifiable Ownership** - All memberships are blockchain-verified assets
- **Smart Contracts Ready** - Architecture prepared for ink! contracts

## 🛠️ Technologies Used

### Frontend
- **React 18** with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Modern, responsive UI
- **Lucide Icons** - Beautiful icon system

### Blockchain
- **Polkadot.js API** - Core blockchain interaction
- **@polkadot/extension-dapp** - Wallet connection
- **@polkadot/api-contract** - Smart contract support
- **Westend Testnet** - Polkadot test network

### Backend
- **Supabase** - Database and authentication
- **PostgreSQL** - Relational data storage
- **Row Level Security** - Data protection and privacy

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Polkadot.js browser extension
- Modern web browser (Chrome, Firefox, Brave)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/fairpass
cd fairpass
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
The project includes a `.env` file with Supabase credentials already configured. No additional setup needed!

### Step 4: Install Polkadot.js Extension
1. **Chrome**: https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd
2. **Firefox**: https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/

### Step 5: Create Test Account
1. Open Polkadot.js extension
2. Create a new account or import existing
3. Get Westend testnet tokens: https://faucet.polkadot.io/westend

### Step 6: Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Step 7: Initialize NFT Collection (First Time Only)
1. Navigate to Creator Dashboard
2. Click "Initialize Collection" in the NFT Setup card
3. Approve the transaction (requires ~0.1 WND)
4. Wait for confirmation

**Note**: This only needs to be done once. See [NFT_INTEGRATION.md](./NFT_INTEGRATION.md) for details.

### Step 8: Build for Production
```bash
npm run build
npm run preview
```

## 🎮 Usage Guide

### First Time Setup
1. **Connect Wallet** - Click "Connect Wallet" and approve FairPass in Polkadot.js
2. **Choose Mode**:
   - **Real Mode**: Use actual Westend testnet (requires WND tokens)
   - **Demo Mode**: Test without blockchain (simulated transactions)

### For Creators
1. Navigate to **Creator Dashboard**
2. Click **"Create Your Profile"**
3. Fill in your name, bio, and avatar URL
4. Click **"Create New Tier"** to add membership levels
5. Set price, duration, and benefits
6. Share your profile link with fans!

### For Fans
1. Browse the **Marketplace** to discover creators
2. Use filters to find memberships by price or duration
3. Click **"Purchase Membership"** on any tier
4. Review details and confirm transaction
5. Your NFT membership is minted and sent to your wallet!
6. View active memberships in **"My Memberships"**

### Secondary Market
1. Go to **"Secondary Market"**
2. See all available resale listings
3. Purchase discounted memberships from other fans
4. Or list your own memberships for sale

## 🏗️ Architecture

### Smart Contract Design (Future Enhancement)
```
MembershipNFT Contract (ink!)
├── mint() - Create new membership NFT
├── transfer() - Transfer ownership
├── renew() - Extend membership duration
├── setRoyalty() - Configure creator royalties
└── isActive() - Check membership validity
```

### Database Schema
```
creators
├── id (uuid)
├── wallet_address (text)
├── name, bio, avatar_url
└── created_at

membership_tiers
├── id (uuid)
├── creator_id (fk)
├── name, description
├── price_dot, duration_days
├── max_supply, royalty_percent
└── is_active

memberships
├── id (uuid)
├── tier_id (fk)
├── owner_wallet, original_buyer_wallet
├── token_id, metadata_uri
├── expires_at, is_active
└── created_at

transactions
├── membership_id (fk)
├── from_wallet, to_wallet
├── transaction_type (mint/transfer/secondary_sale)
├── price_dot, tx_hash
└── created_at
```

## 🚧 Current Limitations & Future Roadmap

### Current State (Hackathon Demo)
✅ Full UI/UX implementation
✅ Real Polkadot wallet connection
✅ Westend testnet integration
✅ Real DOT transfers
✅ Real NFT minting with Uniques pallet
✅ On-chain metadata storage
✅ Complete database architecture

### Phase 1 (Post-Hackathon)
- [x] Real NFT minting with Uniques pallet
- [x] On-chain metadata storage
- [ ] IPFS integration for rich metadata (images, attributes)
- [ ] Enhanced secondary market features
- [ ] NFT gallery and portfolio view

### Phase 2 (Production)
- [ ] Mainnet deployment
- [ ] Multi-chain support (Parachains)
- [ ] Creator analytics dashboard
- [ ] Content delivery integration
- [ ] Mobile apps (iOS/Android)

### Phase 3 (Scale)
- [ ] Decentralized governance (DAO)
- [ ] Creator verification system
- [ ] Advanced discovery algorithms
- [ ] API for third-party integrations




## 📄 License

MIT License - See LICENSE file for details

## Acknowledgments

- **Polkadot Foundation** - For the amazing Web3 infrastructure
- **Parity Technologies** - For Substrate and Polkadot.js
- **Supabase** - For the database platform
- **Web3 Foundation** - For supporting the decentralized web
