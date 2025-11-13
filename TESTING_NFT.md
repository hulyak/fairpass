# Testing NFT Integration

## Quick Test Guide

Follow these steps to test the real NFT minting functionality on Westend testnet.

## Prerequisites

1. **Install Polkadot.js Extension**
   - Chrome: https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/

2. **Create Westend Account**
   - Open Polkadot.js extension
   - Click "+" to create new account
   - Select "Westend" network
   - Save your seed phrase securely

3. **Get Testnet Tokens**
   - Visit: https://faucet.polkadot.io/westend
   - Paste your Westend address
   - Request tokens (you'll get ~1 WND)
   - Wait 1-2 minutes for confirmation

## Step-by-Step Testing

### 1. Start the Application

```bash
npm install
npm run dev
```

Open http://localhost:5173

### 2. Connect Wallet

1. Click "Connect Wallet" in top right
2. Select "Real Mode" (not Demo Mode)
3. Approve FairPass in Polkadot.js extension
4. Select your Westend account
5. Verify your balance shows in the UI

### 3. Initialize NFT Collection (First Time Only)

1. Navigate to "For Creators" → Creator Dashboard
2. Create your creator profile if needed:
   - Name: "Test Creator"
   - Bio: "Testing FairPass NFTs"
   - Avatar URL: (optional)
3. Find the "NFT Collection Setup" card
4. Click "Initialize Collection"
5. Approve transaction in Polkadot.js extension
6. Wait 10-20 seconds for confirmation
7. You should see "Collection Ready!" message

**Note**: If you see "Collection already exists", that's fine! Someone already initialized it.

### 4. Create a Membership Tier

1. Click "Create Tier" button
2. Fill in details:
   - Name: "Gold Membership"
   - Description: "Premium access"
   - Price: 0.1 DOT
   - Duration: 30 days
   - Benefits: "Exclusive content, Early access"
3. Click "Create Tier"
4. Tier should appear in your dashboard

### 5. Purchase a Membership (Mint NFT)

1. Navigate to "Marketplace"
2. Find your "Gold Membership" tier
3. Click "Purchase Membership"
4. Review details in confirmation modal
5. Click "Confirm Purchase"
6. **Two transactions will be signed:**
   - First: DOT transfer to creator
   - Second: NFT minting
7. Approve both in Polkadot.js extension
8. Wait 20-30 seconds for confirmation
9. Success modal shows your NFT token ID!

### 6. Verify NFT On-Chain

#### Option A: Polkadot.js Apps

1. Go to https://polkadot.js.org/apps/?rpc=wss://westend-rpc.polkadot.io#/chainstate
2. Select `uniques` pallet
3. Select `asset(u32, u32)` query
4. Enter:
   - Collection: `1000`
   - Item: (extract number from your token ID, e.g., "FP-1699..." → 1699...)
5. Click "+" to query
6. You should see owner address and other details

#### Option B: Check in Database

1. Navigate to "My Memberships"
2. Your purchased membership should appear
3. Shows token ID, expiry date, and status

### 7. View Transaction History

1. Navigate to "Transaction History"
2. See all your purchases with:
   - Transaction type (mint)
   - Price paid
   - Transaction hash
   - Timestamp

## Verification Checklist

- [ ] Wallet connects successfully
- [ ] Balance displays correctly
- [ ] Collection initializes (or already exists)
- [ ] Creator profile created
- [ ] Membership tier created
- [ ] Purchase flow completes
- [ ] Two transactions signed (payment + mint)
- [ ] Success modal shows token ID
- [ ] NFT appears in "My Memberships"
- [ ] Transaction recorded in history
- [ ] NFT verifiable on Polkadot.js Apps

## Common Issues

### "Insufficient balance"
- Make sure you have at least 0.2 WND
- Get more from faucet if needed

### "Extension not found"
- Install Polkadot.js extension
- Refresh the page
- Try different browser

### "Transaction failed"
- Check Westend network status
- Ensure you're on Westend (not Polkadot mainnet)
- Try again after 30 seconds

### "Collection already exists"
- This is normal! Skip to step 4
- Collection only needs initialization once

### Minting takes too long
- Westend can be slow during peak times
- Wait up to 60 seconds
- Check browser console for errors

## Expected Costs

All on Westend testnet (free tokens):

- Collection creation: ~0.1 WND (one-time)
- Membership purchase: 0.1 DOT (to creator)
- NFT minting: ~0.01 WND (gas fee)
- Metadata setting: ~0.01 WND (gas fee)
- **Total per purchase**: ~0.12 WND

## Advanced Testing

### Test NFT Transfer

```typescript
// In browser console
import { transferNFT } from './src/lib/polkadot';

// Transfer NFT to another address
await transferNFT(
  'YOUR_ADDRESS',
  'RECIPIENT_ADDRESS',
  ITEM_ID
);
```

### Query NFT Owner

```typescript
import { getNFTOwner } from './src/lib/polkadot';

const owner = await getNFTOwner(ITEM_ID);
console.log('NFT owner:', owner);
```

### Check Collection Details

On Polkadot.js Apps:
1. Navigate to Chain State
2. Select `uniques` → `class(u32)`
3. Enter collection ID: `1000`
4. See collection owner, items count, etc.



## Troubleshooting Resources

- **Polkadot.js Apps**: https://polkadot.js.org/apps/
- **Westend Faucet**: https://faucet.polkadot.io/westend
- **Subscan Explorer**: https://westend.subscan.io/
- **Discord Support**: (your Discord link)

## Success Criteria

✅ Real blockchain transactions
✅ Actual NFTs minted on-chain
✅ Verifiable ownership
✅ Metadata stored on-chain

