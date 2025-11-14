# Westend Asset Hub Setup Guide

## Why Your Balance Shows 0

If you used the Westend faucet but your FairPass app shows 0 balance, here's why:

**The Problem:**
- The faucet gives you WND on **Westend Relay Chain**
- FairPass uses **Westend Asset Hub** (a system parachain) for NFTs
- These are **different chains** with separate balances

**The Solution:**
You need to **teleport** (cross-chain transfer) your WND from Relay Chain to Asset Hub.

---

## Step-by-Step: Transfer Funds to Asset Hub

### Method 1: Using Polkadot.js Apps (Easiest)

1. **Get Funds on Relay Chain**
   - Go to: https://faucet.polkadot.io/westend
   - Enter your wallet address
   - Click "Get WND"
   - Wait for confirmation

2. **Open Polkadot.js Apps**
   - Go to: https://polkadot.js.org/apps/?rpc=wss://westend-rpc.polkadot.io#/teleport
   - Connect your wallet (Polkadot Developer Signer, SubWallet, or Talisman)
   - Select your account

3. **Teleport to Asset Hub**
   - **Origin Chain**: Westend (Relay Chain)
   - **Destination**: Westend Asset Hub
   - **Amount**: Transfer at least 10 WND (leave some for fees on Relay Chain)
   - **Destination Account**: Same as your origin account (should auto-fill)
   - Click "Teleport"
   - Sign the transaction

4. **Verify Transfer**
   - Switch network to Asset Hub:
     - Change RPC to: `wss://westend-asset-hub-rpc.polkadot.io`
   - Check your balance in the app
   - Should now show WND on Asset Hub

---

### Method 2: Using Code (Advanced)

```typescript
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';

async function teleportToAssetHub(fromAddress: string, amount: string) {
  // Connect to Relay Chain
  const relayProvider = new WsProvider('wss://westend-rpc.polkadot.io');
  const relayApi = await ApiPromise.create({ provider: relayProvider });

  // Get injector for signing
  const injector = await web3FromAddress(fromAddress);

  // Amount in Plancks (1 WND = 1e12 Plancks)
  const amountInPlancks = BigInt(parseFloat(amount) * 1e12);

  // Teleport to Asset Hub (parachain ID 1000)
  const dest = {
    V3: {
      parents: 0,
      interior: {
        X1: {
          Parachain: 1000 // Asset Hub parachain ID
        }
      }
    }
  };

  const beneficiary = {
    V3: {
      parents: 0,
      interior: {
        X1: {
          AccountId32: {
            id: fromAddress,
            network: null
          }
        }
      }
    }
  };

  const assets = {
    V3: [
      {
        id: { Concrete: { parents: 0, interior: 'Here' } },
        fun: { Fungible: amountInPlancks }
      }
    ]
  };

  const tx = relayApi.tx.xcmPallet.limitedTeleportAssets(
    dest,
    beneficiary,
    assets,
    0,
    'Unlimited'
  );

  await tx.signAndSend(fromAddress, { signer: injector.signer }, ({ status }) => {
    if (status.isInBlock) {
      console.log('Teleport successful!');
    }
  });
}
```

---

## Understanding the Network Structure

```
Westend Relay Chain (wss://westend-rpc.polkadot.io)
│
├─ Asset Hub (wss://westend-asset-hub-rpc.polkadot.io) ← FairPass uses this!
│  └─ Has: NFTs pallet, Assets pallet
│
├─ Other Parachains
│  └─ Bridgehub, Collectives, etc.
```

**Key Points:**
- **Relay Chain**: Coordinates parachains, handles security
- **Asset Hub**: Specialized for assets (NFTs, tokens)
- **Separate Balances**: Each chain tracks its own balances
- **XCM/Teleport**: Moves assets between chains

---

## Quick Reference

### Network Endpoints

| Network | RPC Endpoint | Purpose |
|---------|-------------|---------|
| **Westend Relay** | `wss://westend-rpc.polkadot.io` | Get faucet funds here |
| **Asset Hub** | `wss://westend-asset-hub-rpc.polkadot.io` | NFTs live here (FairPass uses this) |

### Faucet

- **URL**: https://faucet.polkadot.io/westend
- **Network**: Westend Relay Chain
- **Amount**: 1 WND per request
- **Cooldown**: 24 hours

### Minimum Balances

- **Relay Chain**: Keep at least 1-2 WND for fees
- **Asset Hub**: Transfer at least 10 WND for testing NFTs
- **NFT Operations**:
  - Create Collection: ~1-2 WND deposit
  - Mint NFT: ~0.01-0.1 WND per mint

---

## Troubleshooting

### "Balance shows 0 in FairPass"
✅ **Solution**: You have funds on Relay Chain but need to teleport to Asset Hub
- Follow the teleport steps above

### "Cannot read properties of undefined (reading 'create')"
✅ **Solution**: Wrong network - FairPass now connects to Asset Hub
- Make sure code uses: `wss://westend-asset-hub-rpc.polkadot.io`

### "Insufficient balance to create collection"
✅ **Solution**: Need more WND on Asset Hub
- Teleport at least 10 WND from Relay Chain
- Collection creation requires a deposit (~1-2 WND)

### "Transaction fails with ExtrinsicFailed"
❓ **Possible Causes**:
- Insufficient balance for transaction + deposit
- Collection ID already exists
- Account doesn't have permission (for some operations)

**Debug Steps**:
1. Check balance on Asset Hub (not Relay Chain)
2. Check browser console for detailed error
3. Verify you're on the correct network

---

## Testing Checklist

Before testing FairPass:

- [ ] Got WND from faucet on Relay Chain
- [ ] Teleported at least 10 WND to Asset Hub
- [ ] Verified balance shows in FairPass app
- [ ] Browser console shows "Connected to Westend Asset Hub successfully!"
- [ ] Ready to create collection and mint NFTs

---

## Helpful Links

- **Polkadot.js Apps**: https://polkadot.js.org/apps/
- **Westend Faucet**: https://faucet.polkadot.io/westend
- **Asset Hub Explorer**: https://assethub-westend.subscan.io/
- **XCM Documentation**: https://wiki.polkadot.network/docs/learn-xcm
- **Teleport Guide**: https://wiki.polkadot.network/docs/learn-teleport

---

## Summary

1. **Faucet** → Get WND on Relay Chain
2. **Teleport** → Move WND to Asset Hub
3. **Build** → Use FairPass on Asset Hub
4. **Test** → Create collections, mint NFTs

**Remember**: The faucet gives you funds on the **Relay Chain**, but NFTs live on **Asset Hub**. You must teleport funds between them!
