import { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, Clock, Award, Tag } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { supabase, MarketplaceListing } from '../lib/supabase';
import { generateMockTxHash } from '../lib/polkadot';

type ListingWithDetails = MarketplaceListing & {
  membership: {
    token_id: string;
    expires_at: string;
    transfer_count: number;
    tier: {
      name: string;
      duration_days: number;
      royalty_percentage: number;
      creator: {
        name: string;
      };
    };
  };
};

export function SecondaryMarket() {
  const { selectedAccount } = useWallet();
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    const { data } = await supabase
      .from('marketplace_listings')
      .select(`
        *,
        membership:memberships(
          token_id,
          expires_at,
          transfer_count,
          tier:membership_tiers(
            name,
            duration_days,
            royalty_percentage,
            creator:creators(name)
          )
        )
      `)
      .eq('is_active', true)
      .gt('membership.expires_at', new Date().toISOString())
      .order('listed_at', { ascending: false });

    if (data) {
      const formattedData = data
        .filter(listing => listing.membership)
        .map(listing => ({
          ...listing,
          membership: {
            ...listing.membership,
            tier: {
              ...listing.membership.tier,
              creator: Array.isArray(listing.membership.tier.creator)
                ? listing.membership.tier.creator[0]
                : listing.membership.tier.creator
            }
          }
        }));
      setListings(formattedData);
    }
    setLoading(false);
  };

  const handlePurchase = async (listing: ListingWithDetails) => {
    if (!selectedAccount) {
      alert('Please connect your wallet first');
      return;
    }

    if (selectedAccount.address === listing.seller_wallet) {
      alert('You cannot buy your own listing');
      return;
    }

    const confirmed = confirm(
      `Purchase ${listing.membership.tier.name} membership for ${listing.price_dot} DOT?\n\nExpires: ${new Date(listing.membership.expires_at).toLocaleDateString()}\n\nRoyalty: ${listing.membership.tier.royalty_percentage}% will go to the creator.`
    );

    if (!confirmed) return;

    try {
      const royaltyAmount = listing.price_dot * (listing.membership.tier.royalty_percentage / 100);
      const sellerAmount = listing.price_dot - royaltyAmount;
      const txHash = generateMockTxHash();

      await supabase
        .from('memberships')
        .update({
          owner_wallet: selectedAccount.address,
          transfer_count: listing.membership.transfer_count + 1,
          last_transfer_at: new Date().toISOString(),
        })
        .eq('id', listing.membership_id);

      await supabase
        .from('marketplace_listings')
        .update({
          is_active: false,
          sold_at: new Date().toISOString(),
        })
        .eq('id', listing.id);

      await supabase
        .from('transactions')
        .insert([{
          membership_id: listing.membership_id,
          from_wallet: listing.seller_wallet,
          to_wallet: selectedAccount.address,
          transaction_type: 'sale',
          price_dot: listing.price_dot,
          tx_hash: txHash,
        }]);

      alert(
        `Purchase successful!\n\nYou paid: ${listing.price_dot} DOT\nSeller received: ${sellerAmount.toFixed(2)} DOT\nCreator royalty: ${royaltyAmount.toFixed(2)} DOT\n\nTransaction: ${txHash.slice(0, 16)}...`
      );

      loadListings();
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-slate-900">Secondary Marketplace</h1>
          <p className="text-slate-600">Buy and sell membership NFTs from other collectors</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Tag className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-bold">{listings.length}</span>
            </div>
            <div className="text-gray-600">Active Listings</div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-bold">
                {listings.length > 0
                  ? (listings.reduce((sum, l) => sum + l.price_dot, 0) / listings.length).toFixed(2)
                  : '0'}
              </span>
            </div>
            <div className="text-gray-600">Avg Price (DOT)</div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-bold">
                {listings.reduce((sum, l) => sum + l.price_dot, 0).toFixed(2)}
              </span>
            </div>
            <div className="text-gray-600">Total Volume (DOT)</div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600">No active listings available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="p-6 bg-white rounded-xl border border-gray-200 hover:border-black transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">{listing.membership.tier.name}</h3>
                      <Award className="w-5 h-5 text-black" />
                    </div>
                    <p className="text-xs text-gray-600">by {listing.membership.tier.creator.name}</p>
                  </div>
                  <div className="px-2 py-1 bg-black/20 text-black rounded text-xs font-medium">
                    Resale
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Token ID</span>
                    <span className="font-mono text-xs">{listing.membership.token_id.slice(0, 12)}...</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Time Left
                    </span>
                    <span className="text-black">{getTimeRemaining(listing.membership.expires_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Creator Royalty</span>
                    <span>{listing.membership.tier.royalty_percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Listed</span>
                    <span>{new Date(listing.listed_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Price</span>
                    <span className="text-2xl font-bold text-black">{listing.price_dot} DOT</span>
                  </div>
                </div>

                <button
                  onClick={() => handlePurchase(listing)}
                  disabled={!selectedAccount || selectedAccount.address === listing.seller_wallet}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                >
                  {!selectedAccount
                    ? 'Connect Wallet'
                    : selectedAccount.address === listing.seller_wallet
                    ? 'Your Listing'
                    : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
