import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Creator = {
  id: string;
  wallet_address: string;
  name: string;
  bio: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
};

export type MembershipTier = {
  id: string;
  creator_id: string;
  name: string;
  description: string;
  price_dot: number;
  duration_days: number;
  max_supply: number | null;
  royalty_percentage: number;
  is_active: boolean;
  created_at: string;
};

export type Membership = {
  id: string;
  tier_id: string;
  owner_wallet: string;
  original_buyer_wallet: string;
  token_id: string;
  metadata_uri: string;
  minted_at: string;
  expires_at: string;
  transfer_count: number;
  last_transfer_at: string | null;
};

export type Transaction = {
  id: string;
  membership_id: string;
  from_wallet: string;
  to_wallet: string;
  transaction_type: 'mint' | 'transfer' | 'renewal' | 'sale';
  price_dot: number | null;
  tx_hash: string;
  created_at: string;
};

export type MarketplaceListing = {
  id: string;
  membership_id: string;
  seller_wallet: string;
  price_dot: number;
  is_active: boolean;
  listed_at: string;
  sold_at: string | null;
};
