# FairPass Setup Guide

Quick start guide to get FairPass running for hackathon judges and developers.

## Prerequisites Checklist

- [ ] Node.js 18 or higher installed
- [ ] npm or yarn package manager
- [ ] Modern web browser (Chrome, Firefox, Brave)
- [ ] Polkadot.js browser extension (optional for demo mode)

## Quick Start (Demo Mode)

**Fastest way to try FairPass without blockchain setup:**

```bash
# 1. Clone and install
git clone <repository-url>
cd fairpass
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# Navigate to http://localhost:5173

# 4. Click "Connect Wallet"
# 5. Choose "Use Demo Mode"
# 6. Explore the platform!
```

**Demo Mode Features:**
- ✅ Full UI/UX
- ✅ Create creator profiles
- ✅ Set up membership tiers
- ✅ Simulate purchases
- ✅ View all features
- ❌ No real blockchain transactions

## Full Setup (Real Blockchain)

### Step 1: Install Polkadot.js Extension

**For Chrome:**
1. Visit: https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd
2. Click "Add to Chrome"
3. Pin extension to toolbar

**For Firefox:**
1. Visit: https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/
2. Click "Add to Firefox"
3. Pin extension to toolbar

### Step 2: Create Polkadot Account

1. Click Polkadot.js extension icon
2. Click the "+" button
3. Choose "Create new account"
4. **IMPORTANT**: Save your 12-word seed phrase securely
5. Set account name and password
6. Click "Add the account with the generated seed"

### Step 3: Get Westend Testnet Tokens

1. Copy your Polkadot address (click extension → click account → copy address)
2. Visit: https://faucet.polkadot.io/westend
3. Paste your address
4. Complete captcha
5. Click "Submit"
6. Wait 1-2 minutes for tokens to arrive
7. You should receive ~10 WND (Westend tokens)

**Alternative Faucets:**
- https://matrix.to/#/#westend_faucet:matrix.org (Matrix room)
- Ask in Polkadot Discord: https://discord.gg/polkadot

### Step 4: Run FairPass

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open browser to `http://localhost:5173`

### Step 5: Connect Real Wallet

1. Click "Connect Wallet" button
2. Polkadot.js extension will pop up
3. Select your account
4. Click "Yes, allow this application access"
5. Your wallet is now connected!

### Step 6: Test Purchase Flow

1. **Create Creator Profile**
   - Navigate to "Creator Dashboard"
   - Click "Create Your Profile"
   - Fill in name, bio, avatar URL
   - Submit

2. **Create Membership Tier**
   - Click "Create New Tier"
   - Set name: "Bronze Member"
   - Set price: 0.1 DOT
   - Set duration: 30 days
   - Add benefits
   - Click "Create Tier"

3. **Purchase as Fan**
   - Open new incognito window (or second wallet)
   - Connect different wallet
   - Go to "Marketplace"
   - Find your tier
   - Click "Purchase Membership"
   - Confirm transaction in Polkadot.js
   - Wait for blockchain confirmation
   - Success!

## Troubleshooting

### "Polkadot extension not found"
**Solution**: Install Polkadot.js extension and refresh page

### "Insufficient balance"
**Solution**: Get more testnet tokens from faucet

### "Transaction failed"
**Solutions**:
- Ensure you have enough WND for transaction + fees
- Check network connection
- Try refreshing and reconnecting wallet
- Wait a few seconds and retry

### "Cannot connect to RPC"
**Solutions**:
- Check internet connection
- Westend RPC may be down (try again in a few minutes)
- Clear browser cache and reload

### Database errors
**Solution**: The Supabase database is pre-configured. If you see errors:
- Check `.env` file exists
- Verify Supabase project is active
- Contact support if persists

## Environment Variables

The project includes a `.env` file with configuration:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**These are already configured for the hackathon submission!**

## Building for Production

```bash
# Type check
npm run typecheck

# Build
npm run build

# Preview build
npm run preview
```

Build output goes to `dist/` directory.

## Testing Checklist

### Creator Flow
- [ ] Connect wallet
- [ ] Create profile
- [ ] Create membership tier
- [ ] View dashboard stats
- [ ] Edit tier settings

### Fan Flow
- [ ] Browse marketplace
- [ ] Filter/search creators
- [ ] Purchase membership
- [ ] View "My Memberships"
- [ ] Check transaction history

### Blockchain Verification
- [ ] Wallet balance shows correctly
- [ ] DOT transfers execute
- [ ] Transaction appears on-chain
- [ ] Balance updates after purchase
- [ ] Creator receives payment

### UI/UX
- [ ] Responsive on mobile
- [ ] All modals open/close properly
- [ ] Loading states display
- [ ] Error messages show
- [ ] Success confirmations appear

## Demo Script (For Judges)

**5-Minute Demo Flow:**

1. **Introduction (30 sec)**
   - "FairPass: Zero-fee creator memberships on Polkadot"
   - Show landing page

2. **Wallet Connection (30 sec)**
   - Click "Connect Wallet"
   - Show real Polkadot.js integration
   - Display balance in Westend tokens

3. **Creator Setup (1 min)**
   - Navigate to Creator Dashboard
   - Create profile with name and bio
   - Create membership tier (0.1 WND)
   - Show dashboard with stats

4. **Fan Purchase (2 min)**
   - Go to Marketplace
   - Find the created tier
   - Click purchase, show confirmation modal
   - Execute real blockchain transaction
   - Show Polkadot.js signing
   - Display success with NFT details

5. **Platform Features (1 min)**
   - Show "My Memberships"
   - Show Transaction History
   - Show Secondary Market
   - Explain future roadmap

6. **Q&A (30 sec)**

## Support & Resources

- **GitHub Issues**: Report bugs and request features
- **Documentation**: See README.md and ARCHITECTURE.md
- **Polkadot Resources**: https://wiki.polkadot.network
- **Polkadot.js Docs**: https://polkadot.js.org/docs/

## Next Steps After Setup

1. Explore the codebase
2. Read ARCHITECTURE.md for technical details
3. Try demo mode first
4. Then test with real blockchain
5. Provide feedback!

---

**Questions?** Open an issue on GitHub or contact the team.

**Enjoy exploring FairPass!** 🚀
