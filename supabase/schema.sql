-- FairPass Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Creators table
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membership tiers table
CREATE TABLE membership_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_dot DECIMAL NOT NULL,
  duration_days INTEGER NOT NULL,
  max_supply INTEGER,
  royalty_percentage DECIMAL DEFAULT 5.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memberships (NFTs) table
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier_id UUID REFERENCES membership_tiers(id) ON DELETE CASCADE,
  owner_wallet TEXT NOT NULL,
  original_buyer_wallet TEXT NOT NULL,
  token_id TEXT UNIQUE NOT NULL,
  metadata_uri TEXT,
  minted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  transfer_count INTEGER DEFAULT 0,
  last_transfer_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  membership_id UUID REFERENCES memberships(id) ON DELETE CASCADE,
  from_wallet TEXT NOT NULL,
  to_wallet TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('mint', 'transfer', 'renewal', 'sale')),
  price_dot DECIMAL,
  tx_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace listings table
CREATE TABLE marketplace_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  membership_id UUID REFERENCES memberships(id) ON DELETE CASCADE,
  seller_wallet TEXT NOT NULL,
  price_dot DECIMAL NOT NULL,
  is_active BOOLEAN DEFAULT true,
  listed_at TIMESTAMPTZ DEFAULT NOW(),
  sold_at TIMESTAMPTZ
);

-- Indexes for better query performance
CREATE INDEX idx_creators_wallet ON creators(wallet_address);
CREATE INDEX idx_tiers_creator ON membership_tiers(creator_id);
CREATE INDEX idx_memberships_owner ON memberships(owner_wallet);
CREATE INDEX idx_memberships_tier ON memberships(tier_id);
CREATE INDEX idx_transactions_membership ON transactions(membership_id);
CREATE INDEX idx_listings_membership ON marketplace_listings(membership_id);
CREATE INDEX idx_listings_active ON marketplace_listings(is_active) WHERE is_active = true;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Creators policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON creators FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON creators FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON creators FOR UPDATE
  USING (true);

-- Membership tiers policies
CREATE POLICY "Tiers are viewable by everyone"
  ON membership_tiers FOR SELECT
  USING (true);

CREATE POLICY "Creators can insert their own tiers"
  ON membership_tiers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Creators can update their own tiers"
  ON membership_tiers FOR UPDATE
  USING (true);

-- Memberships policies
CREATE POLICY "Memberships are viewable by everyone"
  ON memberships FOR SELECT
  USING (true);

CREATE POLICY "System can insert memberships"
  ON memberships FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners can update their memberships"
  ON memberships FOR UPDATE
  USING (true);

-- Transactions policies
CREATE POLICY "Transactions are viewable by everyone"
  ON transactions FOR SELECT
  USING (true);

CREATE POLICY "System can insert transactions"
  ON transactions FOR INSERT
  WITH CHECK (true);

-- Marketplace listings policies
CREATE POLICY "Listings are viewable by everyone"
  ON marketplace_listings FOR SELECT
  USING (true);

CREATE POLICY "Users can create listings"
  ON marketplace_listings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sellers can update their listings"
  ON marketplace_listings FOR UPDATE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_creators_updated_at
  BEFORE UPDATE ON creators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE creators IS 'Content creators who offer memberships';
COMMENT ON TABLE membership_tiers IS 'Different membership levels offered by creators';
COMMENT ON TABLE memberships IS 'Individual NFT memberships owned by users';
COMMENT ON TABLE transactions IS 'All blockchain transactions (mints, transfers, sales)';
COMMENT ON TABLE marketplace_listings IS 'Secondary market listings for reselling memberships';
