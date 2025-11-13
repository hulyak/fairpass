# FairPass Architecture

## System Overview

FairPass is built as a hybrid Web3 application combining blockchain technology with traditional database infrastructure for optimal performance and user experience.

## Technology Stack

### Frontend Layer
```
┌─────────────────────────────────────┐
│   React 18 + TypeScript + Vite      │
│   - Component-based architecture    │
│   - Type-safe development          │
│   - Fast HMR development           │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│     UI Layer (Tailwind CSS)         │
│   - Responsive design              │
│   - Light blue theme               │
│   - Accessible components          │
└─────────────────────────────────────┘
```

### Blockchain Layer
```
┌─────────────────────────────────────┐
│    Polkadot.js Extension Wallet     │
│   - Account management             │
│   - Transaction signing            │
│   - Key storage                    │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      Polkadot.js API Client         │
│   - WebSocket connection           │
│   - API promise handling           │
│   - Balance queries                │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│     Westend Testnet (Polkadot)      │
│   - Test DOT transfers             │
│   - Transaction validation         │
│   - Block confirmation             │
└─────────────────────────────────────┘
```

### Data Layer
```
┌─────────────────────────────────────┐
│      Supabase Client Library        │
│   - Type-safe queries              │
│   - Real-time subscriptions        │
│   - Authentication                 │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│    PostgreSQL + Row Level Security  │
│   - creators                       │
│   - membership_tiers               │
│   - memberships                    │
│   - transactions                   │
└─────────────────────────────────────┘
```

## Core Components

### 1. Wallet Management (`WalletContext.tsx`)
**Purpose**: Centralized wallet state management

**Features**:
- Connect to Polkadot.js extension
- Account selection and switching
- Demo mode for testing
- Persistent connection state

**Flow**:
```
User clicks "Connect"
     │
     ▼
Request extension access
     │
     ▼
Fetch accounts from extension
     │
     ▼
Store in React context
     │
     ▼
Persist to localStorage
```

### 2. Blockchain Integration (`lib/polkadot.ts`)
**Purpose**: All blockchain interactions

**Functions**:
- `enablePolkadotExtension()` - Request extension access
- `getPolkadotAccounts()` - Fetch user accounts
- `getPolkadotApi()` - Connect to Westend RPC
- `getAccountBalance()` - Query account balance
- `transferDOT()` - Execute token transfers
- `mintMembershipNFT()` - Generate NFT metadata

**Connection Management**:
```typescript
// Singleton pattern for API instance
let apiInstance: ApiPromise | null = null;

export async function getPolkadotApi(): Promise<ApiPromise> {
  if (apiInstance && apiInstance.isConnected) {
    return apiInstance;
  }
  const provider = new WsProvider(WESTEND_RPC);
  apiInstance = await ApiPromise.create({ provider });
  return apiInstance;
}
```

### 3. Database Schema

#### creators Table
```sql
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### membership_tiers Table
```sql
CREATE TABLE membership_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id),
  name TEXT NOT NULL,
  description TEXT,
  price_dot DECIMAL NOT NULL,
  duration_days INTEGER NOT NULL,
  benefits TEXT[],
  max_supply INTEGER,
  royalty_percent DECIMAL DEFAULT 5.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### memberships Table
```sql
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id UUID REFERENCES membership_tiers(id),
  owner_wallet TEXT NOT NULL,
  original_buyer_wallet TEXT NOT NULL,
  token_id TEXT UNIQUE NOT NULL,
  metadata_uri TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id UUID REFERENCES memberships(id),
  from_wallet TEXT NOT NULL,
  to_wallet TEXT NOT NULL,
  transaction_type TEXT NOT NULL,
  price_dot DECIMAL NOT NULL,
  tx_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Data Flow

### Purchase Flow
```
1. User selects membership tier
        │
        ▼
2. Confirmation modal displays
        │
        ▼
3. User confirms purchase
        │
        ▼
4. Transfer DOT to creator wallet
        │ (Real Polkadot transaction)
        ▼
5. Generate NFT metadata
        │
        ▼
6. Insert membership record
        │ (Supabase)
        ▼
7. Record transaction
        │ (Supabase)
        ▼
8. Display success modal
```

### Creator Dashboard Flow
```
1. Load creator profile
        │
        ▼
2. Fetch membership tiers
        │
        ▼
3. Query statistics
   - Total members
   - Active tiers
   - Revenue
        │
        ▼
4. Display dashboard
        │
        ▼
5. Real-time updates
   (Supabase subscriptions)
```

## Security Model

### Row Level Security (RLS)

#### creators Table
```sql
-- Users can view all creator profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON creators FOR SELECT
  USING (true);

-- Only wallet owner can update their profile
CREATE POLICY "Users can update own profile"
  ON creators FOR UPDATE
  USING (auth.uid() = id);
```

#### memberships Table
```sql
-- Users can view their own memberships
CREATE POLICY "Users can view own memberships"
  ON memberships FOR SELECT
  USING (owner_wallet = current_user_wallet());

-- System can insert memberships
CREATE POLICY "System can insert memberships"
  ON memberships FOR INSERT
  WITH CHECK (true);
```

### Transaction Security
- All DOT transfers require wallet signature
- No private keys stored in application
- Transaction hashes verified on-chain
- Database records are append-only

## Current NFT Implementation (Uniques Pallet)

### Real On-Chain NFTs

FairPass uses Polkadot's native **Uniques pallet** for NFT functionality:

```typescript
// Collection ID for all FairPass memberships
const FAIRPASS_COLLECTION_ID = 1000;

// Create collection (one-time setup)
api.tx.uniques.create(collectionId, admin)

// Mint membership NFT
api.tx.uniques.mint(collectionId, itemId, owner)

// Set on-chain metadata
api.tx.uniques.setMetadata(collectionId, itemId, metadata, isFrozen)

// Transfer NFT
api.tx.uniques.transfer(collectionId, itemId, newOwner)
```

### Benefits of Uniques Pallet

1. **Native to Polkadot** - No smart contract deployment needed
2. **Low Cost** - Minimal transaction fees
3. **Battle-Tested** - Used by major parachains
4. **Simple Integration** - Direct extrinsic calls
5. **On-Chain Metadata** - No external storage required

### NFT Lifecycle

```
Purchase → Mint NFT → Set Metadata → Transfer to Buyer
    ↓          ↓            ↓              ↓
  Pay DOT   Create NFT   Store Info    Ownership
```

## Future Architecture (Smart Contracts)

### Phase 2: Custom ink! Contract (Optional)

For advanced features, we may deploy a custom ink! contract:

```rust
#[ink::contract]
mod fairpass_nft {
    #[ink(storage)]
    pub struct FairPassNFT {
        owner: AccountId,
        next_token_id: u64,
        tokens: Mapping<u64, MembershipData>,
        balances: Mapping<AccountId, u64>,
    }

    pub struct MembershipData {
        tier_id: Hash,
        expires_at: Timestamp,
        metadata_uri: String,
        creator: AccountId,
        royalty_percent: u8,
    }
}
```

### Phase 2: Marketplace Contract
```rust
#[ink::contract]
mod fairpass_marketplace {
    pub struct Listing {
        token_id: u64,
        seller: AccountId,
        price: Balance,
        is_active: bool,
    }

    #[ink(message)]
    pub fn list_membership(&mut self, token_id: u64, price: Balance);

    #[ink(message, payable)]
    pub fn purchase_listing(&mut self, listing_id: u64);
}
```

## Performance Optimizations

### Frontend
- Code splitting with dynamic imports
- React.memo for expensive components
- useMemo/useCallback for computed values
- Lazy loading for images

### Blockchain
- WebSocket connection pooling
- Cached API instance
- Batched queries where possible
- Optimistic UI updates

### Database
- Indexed foreign keys
- Materialized views for statistics
- Connection pooling
- Query result caching

## Monitoring & Observability

### Logging
```typescript
console.log('Minting NFT with metadata:', metadata);
console.error('Purchase failed:', error);
```

### Error Handling
```typescript
try {
  await transferDOT(...);
} catch (error) {
  console.error('Transfer failed:', error);
  alert('Transaction failed. Please try again.');
}
```

### Future Enhancements
- Sentry for error tracking
- Analytics for user behavior
- Performance monitoring
- Transaction status tracking

## Deployment

### Current Setup
- Frontend: Vite build → Static hosting
- Database: Supabase managed PostgreSQL
- RPC: Public Westend endpoint

### Production Deployment
- Frontend: Vercel/Netlify
- Database: Supabase Pro
- RPC: Private Polkadot node
- CDN: Cloudflare
- Monitoring: Datadog/New Relic

## Scalability Considerations

### Horizontal Scaling
- Stateless frontend (can scale infinitely)
- Database connection pooling
- Multiple RPC endpoints for load balancing

### Vertical Scaling
- Database read replicas
- Cached queries
- Optimized indexes

### Future: Parachain
- Custom Polkadot parachain
- Lower transaction fees
- Higher throughput
- Custom runtime logic
