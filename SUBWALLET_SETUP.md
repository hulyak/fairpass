# SubWallet Setup for FairPass

## Quick Fix for SubWallet Connection Error

If you're getting an error connecting SubWallet to FairPass, follow these steps:

---

## Step 1: Add Westend Asset Hub Network to SubWallet

SubWallet needs to have Westend Asset Hub configured as a custom network.

### Method A: Add via SubWallet Settings

1. **Open SubWallet Extension**
   - Click the SubWallet icon in your browser

2. **Go to Network Settings**
   - Click the network dropdown (top of extension)
   - Click "Manage networks" or the gear icon

3. **Add Custom Network**
   - Click "+ Add Network" or "Custom Network"
   - Enter the following details:

   ```
   Network Name: Westend Asset Hub
   Network Type: Substrate
   RPC Endpoint: wss://westend-asset-hub-rpc.polkadot.io
   Chain ID: Leave blank (auto-detect)
   Symbol: WND
   Decimals: 12
   ```

4. **Save and Select**
   - Click "Save" or "Add Network"
   - Switch to "Westend Asset Hub" network

5. **Refresh FairPass**
   - Reload the FairPass website
   - Try connecting again

---

### Method B: Import Network via Polkadot.js Apps (Easier)

1. **Go to Polkadot.js Apps**
   - Visit: https://polkadot.js.org/apps/?rpc=wss://westend-asset-hub-rpc.polkadot.io

2. **Connect SubWallet**
   - Click "Connect" in Polkadot.js Apps
   - Select SubWallet
   - Approve connection

3. **SubWallet Will Auto-Add Network**
   - SubWallet should automatically detect Westend Asset Hub
   - The network will be saved in your list

4. **Return to FairPass**
   - Now try connecting to FairPass
   - SubWallet should work

---

## Step 2: Update Network Metadata (Important!)

If you get an error about "outdated metadata" or "update required", follow these steps:

### Method 1: Using Polkadot.js Apps (Recommended)

1. **Go to Polkadot.js Apps with Asset Hub**
   - Visit: https://polkadot.js.org/apps/?rpc=wss://westend-asset-hub-rpc.polkadot.io

2. **Connect SubWallet**
   - Click "Connect" button
   - Select SubWallet from the list
   - Choose your account

3. **Navigate to Settings → Metadata**
   - Click "Settings" in the top navigation
   - Click the "Metadata" tab
   - Click "Update metadata" button

4. **Approve in SubWallet**
   - SubWallet popup will appear asking to approve metadata update
   - Click "Approve"
   - Wait for confirmation

5. **Done!**
   - Metadata is now updated
   - Return to FairPass and try again

### Method 2: Toggle Network in SubWallet

1. **Open SubWallet Extension**
2. **Go to Network Settings**
   - Click network dropdown → Manage networks
3. **Toggle Westend Asset Hub Off**
   - Find Westend Asset Hub in list
   - Toggle it OFF
   - Wait 2 seconds
4. **Toggle it Back ON**
   - Toggle Westend Asset Hub back ON
   - This forces metadata refresh
5. **Reload SubWallet Extension**
   - Close and reopen SubWallet
   - Or go to `chrome://extensions` and click reload

### Method 3: Reload Extension

1. **Go to Extensions Page**
   - Chrome: `chrome://extensions`
   - Brave: `brave://extensions`
   - Edge: `edge://extensions`
2. **Find SubWallet**
   - Locate SubWallet in the list
3. **Click Reload Button**
   - Click the circular arrow icon
   - This reloads the extension
4. **Try FairPass Again**

---

## Step 3: Approve FairPass in SubWallet

When you connect to FairPass:

1. **SubWallet Popup Will Appear**
   - Shows "FairPass wants to connect"
   - Lists permissions requested

2. **Review and Approve**
   - Check "Remember this decision" (optional)
   - Click "Approve" or "Connect"

3. **Select Account**
   - Choose which account to connect
   - Click "Connect"

---

## Step 3: Get Test Tokens on Asset Hub

Once connected, you need WND tokens on Asset Hub:

### Option 1: Direct Faucet (Recommended)
```
https://faucet.polkadot.io/westend?parachain=1000
```
1. Copy your SubWallet address
2. Go to the faucet link above
3. Paste address and complete captcha
4. Get 100 WND directly on Asset Hub

### Option 2: Teleport from Relay Chain
If you already have WND on Westend Relay Chain:
1. Go to: https://polkadot.js.org/apps/?rpc=wss://westend-rpc.polkadot.io#/teleport
2. Connect SubWallet
3. Teleport to Westend Asset Hub (parachain 1000)
4. Transfer at least 10 WND

---

## Troubleshooting Common Issues

### Issue: "Metadata update required" or "Outdated metadata"
**Solution:**
1. Go to: https://polkadot.js.org/apps/?rpc=wss://westend-asset-hub-rpc.polkadot.io
2. Connect SubWallet
3. Settings → Metadata → Update metadata
4. Approve in SubWallet popup
5. Return to FairPass

**Or:** Toggle Westend Asset Hub network OFF and ON in SubWallet settings

### Issue: "No accounts found"
**Solution:**
- Make sure you've created an account in SubWallet
- Go to SubWallet → Accounts → Create Account
- Or import an existing account with seed phrase

### Issue: "Connection timeout" or "Failed to connect"
**Solution:**
1. Check your internet connection
2. Disable VPN/firewall temporarily
3. Try a different RPC endpoint:
   - Alternative: `wss://westend-asset-hub-rpc.dwellir.com`
4. Clear browser cache and reload

### Issue: "Network not found in SubWallet"
**Solution:**
- Follow Step 1 above to add Westend Asset Hub manually
- Make sure you selected "Substrate" network type (not EVM)

### Issue: "Balance shows 0"
**Solution:**
- You're connected to the right network (Asset Hub) but need tokens
- Use the direct faucet: https://faucet.polkadot.io/westend?parachain=1000
- Or use Demo Mode in FairPass to test without tokens

### Issue: "Transaction fails / Insufficient balance"
**Solution:**
- Check balance is on **Asset Hub**, not Relay Chain
- Need at least 2-5 WND for NFT operations
- Get more from faucet (24 hour cooldown between requests)

### Issue: "SubWallet not appearing in FairPass"
**Solution:**
1. Make sure SubWallet extension is installed and unlocked
2. Refresh the FairPass page
3. Try clearing browser cache
4. Check if SubWallet is enabled for this site:
   - Right-click SubWallet icon → Manage Extension
   - Make sure it has permissions for the site

---

## Alternative: Use Demo Mode

If you just want to test FairPass without dealing with networks:

1. **Click "Connect Wallet"**
2. **Click "Use Demo Mode"**
3. **Test Everything**:
   - ✅ Simulated 100 WND balance
   - ✅ Create collections
   - ✅ Mint NFTs
   - ✅ Transfer NFTs
   - ✅ No wallet or tokens needed

---

## Comparison: SubWallet vs Polkadot.js Extension

| Feature | SubWallet | Polkadot.js |
|---------|-----------|-------------|
| **Easy Setup** | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **UI/UX** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Network Management** | Manual add | Auto-detect |
| **Multi-Chain** | ✅ Excellent | ✅ Good |
| **Mobile Support** | ✅ Yes | ❌ No |
| **NFT Display** | ✅ Built-in | ❌ Limited |

**Recommendation:** SubWallet is great for most users, but you need to manually add Westend Asset Hub network first.

---

## Quick Test Checklist

Before using FairPass with SubWallet:

- [ ] SubWallet extension installed
- [ ] Account created in SubWallet
- [ ] Westend Asset Hub network added
- [ ] Connected to Asset Hub (not Relay Chain)
- [ ] Got WND tokens from faucet
- [ ] FairPass approved in SubWallet
- [ ] Can see balance in FairPass app

---

## Support

If you're still having issues:

1. **Check Browser Console** (F12):
   - Look for error messages
   - Check if wallet is detected

2. **Try Demo Mode**:
   - Tests if issue is wallet-related or app-related

3. **Use Polkadot.js Extension Instead**:
   - Download: https://polkadot.js.org/extension/
   - Automatically works with all Polkadot networks

4. **Contact Support**:
   - SubWallet Discord: https://discord.gg/subwallet
   - Polkadot Support: https://support.polkadot.network/

---

## Summary

**TL;DR for SubWallet users:**

1. Add Westend Asset Hub network to SubWallet (RPC: `wss://westend-asset-hub-rpc.polkadot.io`)
2. Get tokens: https://faucet.polkadot.io/westend?parachain=1000
3. Connect to FairPass and approve
4. Start minting NFTs!

Or just use **Demo Mode** to test without any setup. 🎉
