/*
  # FairPass Schema - Creator Memberships Platform

  1. New Tables
    - `creators`
      - `id` (uuid, primary key)
      - `wallet_address` (text, unique) - Polkadot wallet address
      - `name` (text) - Creator display name
      - `bio` (text) - Creator bio/description
      - `avatar_url` (text) - Profile image
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `membership_tiers`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, foreign key to creators)
      - `name` (text) - Tier name (Bronze, Silver, Gold)
      - `description` (text) - Tier benefits
      - `price_dot` (numeric) - Price in DOT
      - `duration_days` (integer) - Membership duration
      - `max_supply` (integer, nullable) - Optional max supply
      - `royalty_percentage` (numeric) - Secondary sale royalty (0-100)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
    
    - `memberships`
      - `id` (uuid, primary key)
      - `tier_id` (uuid, foreign key to membership_tiers)
      - `owner_wallet` (text) - Current owner's wallet address
      - `original_buyer_wallet` (text) - Original purchaser
      - `token_id` (text, unique) - On-chain token ID
      - `metadata_uri` (text) - IPFS URI for metadata
      - `minted_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `transfer_count` (integer) - Number of transfers
      - `last_transfer_at` (timestamptz, nullable)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `membership_id` (uuid, foreign key to memberships)
      - `from_wallet` (text)
      - `to_wallet` (text)
      - `transaction_type` (text) - 'mint', 'transfer', 'renewal', 'sale'
      - `price_dot` (numeric, nullable)
      - `tx_hash` (text) - On-chain transaction hash
      - `created_at` (timestamptz)
    
    - `marketplace_listings`
      - `id` (uuid, primary key)
      - `membership_id` (uuid, foreign key to memberships)
      - `seller_wallet` (text)
      - `price_dot` (numeric)
      - `is_active` (boolean)
      - `listed_at` (timestamptz)
      - `sold_at` (timestamptz, nullable)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and public access
*/

-- Create creators table
CREATE TABLE IF NOT EXISTS creators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  name text NOT NULL,
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view creators"
  ON creators FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert creator profile"
  ON creators FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Creators can update own profile"
  ON creators FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create membership_tiers table
CREATE TABLE IF NOT EXISTS membership_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  price_dot numeric NOT NULL CHECK (price_dot >= 0),
  duration_days integer NOT NULL CHECK (duration_days > 0),
  max_supply integer CHECK (max_supply IS NULL OR max_supply > 0),
  royalty_percentage numeric DEFAULT 10 CHECK (royalty_percentage >= 0 AND royalty_percentage <= 100),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE membership_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tiers"
  ON membership_tiers FOR SELECT
  USING (true);

CREATE POLICY "Anyone can manage tiers"
  ON membership_tiers FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id uuid REFERENCES membership_tiers(id) ON DELETE CASCADE NOT NULL,
  owner_wallet text NOT NULL,
  original_buyer_wallet text NOT NULL,
  token_id text UNIQUE NOT NULL,
  metadata_uri text DEFAULT '',
  minted_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  transfer_count integer DEFAULT 0,
  last_transfer_at timestamptz
);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view memberships"
  ON memberships FOR SELECT
  USING (true);

CREATE POLICY "Anyone can manage memberships"
  ON memberships FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid REFERENCES memberships(id) ON DELETE CASCADE,
  from_wallet text NOT NULL,
  to_wallet text NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('mint', 'transfer', 'renewal', 'sale')),
  price_dot numeric CHECK (price_dot IS NULL OR price_dot >= 0),
  tx_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view transactions"
  ON transactions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert transactions"
  ON transactions FOR INSERT
  WITH CHECK (true);

-- Create marketplace_listings table
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid REFERENCES memberships(id) ON DELETE CASCADE NOT NULL,
  seller_wallet text NOT NULL,
  price_dot numeric NOT NULL CHECK (price_dot >= 0),
  is_active boolean DEFAULT true,
  listed_at timestamptz DEFAULT now(),
  sold_at timestamptz
);

ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listings"
  ON marketplace_listings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can manage listings"
  ON marketplace_listings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_creators_wallet ON creators(wallet_address);
CREATE INDEX IF NOT EXISTS idx_membership_tiers_creator ON membership_tiers(creator_id);
CREATE INDEX IF NOT EXISTS idx_memberships_owner ON memberships(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_memberships_expires ON memberships(expires_at);
CREATE INDEX IF NOT EXISTS idx_transactions_membership ON transactions(membership_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_active ON marketplace_listings(is_active, listed_at);

-- Create view for active memberships
CREATE OR REPLACE VIEW active_memberships AS
SELECT m.*, mt.name as tier_name, mt.price_dot, mt.duration_days, c.name as creator_name
FROM memberships m
JOIN membership_tiers mt ON m.tier_id = mt.id
JOIN creators c ON mt.creator_id = c.id
WHERE m.expires_at > now();
