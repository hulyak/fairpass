import { useState, useEffect } from 'react';
import { ShoppingBag, Clock, TrendingUp, Award, Search, CheckCircle2, X } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { supabase, MembershipTier, Membership } from '../lib/supabase';
import { transferDOT, mintMembershipNFT, MembershipNFTMetadata } from '../lib/polkadot';

type TierWithCreator = MembershipTier & {
  creator: {
    name: string;
    avatar_url: string;
  };
};

export function Marketplace() {
  const { selectedAccount } = useWallet();
  const [tiers, setTiers] = useState<TierWithCreator[]>([]);
  const [filteredTiers, setFilteredTiers] = useState<TierWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [durationFilter, setDurationFilter] = useState<'all' | '30' | '90' | '365'>('all');
  const [purchaseSuccess, setPurchaseSuccess] = useState<{ tokenId: string; expiresAt: Date; tierName: string } | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [confirmPurchase, setConfirmPurchase] = useState<TierWithCreator | null>(null);

  useEffect(() => {
    loadTiers();
  }, []);

  useEffect(() => {
    filterAndSortTiers();
  }, [tiers, searchQuery, priceSort, durationFilter]);

  const loadTiers = async () => {
    const { data } = await supabase
      .from('membership_tiers')
      .select(`
        *,
        creator:creators(name, avatar_url)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (data) {
      const formattedTiers = data.map(tier => ({
        ...tier,
        creator: Array.isArray(tier.creator) ? tier.creator[0] : tier.creator
      }));
      setTiers(formattedTiers);
    }
    setLoading(false);
  };

  const filterAndSortTiers = () => {
    let result = [...tiers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        tier =>
          tier.name.toLowerCase().includes(query) ||
          tier.creator.name.toLowerCase().includes(query) ||
          tier.description.toLowerCase().includes(query)
      );
    }

    if (durationFilter !== 'all') {
      const days = parseInt(durationFilter);
      result = result.filter(tier => {
        if (days === 30) return tier.duration_days <= 30;
        if (days === 90) return tier.duration_days > 30 && tier.duration_days <= 90;
        if (days === 365) return tier.duration_days > 90;
        return true;
      });
    }

    if (priceSort === 'asc') {
      result.sort((a, b) => a.price_dot - b.price_dot);
    } else if (priceSort === 'desc') {
      result.sort((a, b) => b.price_dot - a.price_dot);
    }

    setFilteredTiers(result);
  };

  const handlePurchase = async (tier: TierWithCreator) => {
    if (!selectedAccount) return;
    setConfirmPurchase(tier);
  };

  const executePurchase = async (tier: TierWithCreator) => {
    if (!selectedAccount) return;

    setPurchasing(true);
    setConfirmPurchase(null);

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + tier.duration_days);

      const creatorData = await supabase
        .from('creators')
        .select('wallet_address')
        .eq('id', tier.creator_id)
        .single();

      if (!creatorData.data) throw new Error('Creator not found');

      const metadata: MembershipNFTMetadata = {
        tierId: tier.id,
        tierName: tier.name,
        creatorName: tier.creator.name,
        durationDays: tier.duration_days,
        expiresAt: expiresAt.toISOString(),
      };

      const { tokenId, txHash } = await mintMembershipNFT(selectedAccount.address, metadata);

      let paymentTxHash = 'demo-mode';
      if (!selectedAccount.meta.source.includes('demo')) {
        paymentTxHash = await transferDOT(
          selectedAccount.address,
          creatorData.data.wallet_address,
          tier.price_dot.toString()
        );
      }

      const { data: membership, error: membershipError } = await supabase
        .from('memberships')
        .insert([{
          tier_id: tier.id,
          owner_wallet: selectedAccount.address,
          original_buyer_wallet: selectedAccount.address,
          token_id: tokenId,
          metadata_uri: `ipfs://fairpass/${tokenId}`,
          expires_at: expiresAt.toISOString(),
        }])
        .select()
        .single();

      if (membershipError) throw membershipError;

      await supabase
        .from('transactions')
        .insert([{
          membership_id: membership.id,
          from_wallet: selectedAccount.address,
          to_wallet: creatorData.data.wallet_address,
          transaction_type: 'mint',
          price_dot: tier.price_dot,
          tx_hash: paymentTxHash,
        }]);

      setPurchaseSuccess({ tokenId, expiresAt, tierName: tier.name });
    } catch (error) {
      console.error('Purchase failed:', error);
      alert(`Purchase failed: ${error instanceof Error ? error.message : 'Please try again'}`);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Membership Marketplace</h1>
          <p className="text-gray-600">Discover and purchase creator memberships</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, creator, or description..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as any)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
              >
                <option value="none">Sort by Price</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>

              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value as any)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
              >
                <option value="all">All Durations</option>
                <option value="30">Up to 30 days</option>
                <option value="90">31-90 days</option>
                <option value="365">90+ days</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredTiers.length} memberships available</span>
            {(searchQuery || priceSort !== 'none' || durationFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPriceSort('none');
                  setDurationFilter('all');
                }}
                className="text-black hover:text-emerald-300 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTiers.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600">No memberships available yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTiers.map((tier) => (
              <div
                key={tier.id}
                className="group relative p-6 bg-white rounded-xl border border-gray-200 hover:border-black transition-all hover:shadow-lg"
              >
                <div className="relative">
                  <div className="flex items-start gap-3 mb-4">
                    {tier.creator.avatar_url && (
                      <img
                        src={tier.creator.avatar_url}
                        alt={tier.creator.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-black transition-colors"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                      <p className="text-xs text-gray-600">by {tier.creator.name}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="w-5 h-5 text-black" />
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-6 line-clamp-2 min-h-[40px]">{tier.description}</p>

                  <div className="space-y-2.5 mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Price</span>
                      <span className="font-bold text-black text-lg">{tier.price_dot} DOT</span>
                    </div>
                    <div className="h-px bg-gray-600/50" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Duration
                      </span>
                      <span className="font-medium text-gray-700">{tier.duration_days} days</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Royalty
                      </span>
                      <span className="font-medium text-gray-700">{tier.royalty_percentage}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(tier)}
                    disabled={!selectedAccount}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg font-semibold transition-all shadow-sm hover:shadow-md disabled:shadow-none"
                  >
                    {selectedAccount ? 'Purchase Membership' : 'Connect Wallet'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmPurchase && (
        <ConfirmPurchaseModal
          tier={confirmPurchase}
          onConfirm={() => executePurchase(confirmPurchase)}
          onCancel={() => setConfirmPurchase(null)}
          purchasing={purchasing}
        />
      )}

      {purchaseSuccess && (
        <SuccessModal
          tokenId={purchaseSuccess.tokenId}
          expiresAt={purchaseSuccess.expiresAt}
          tierName={purchaseSuccess.tierName}
          onClose={() => setPurchaseSuccess(null)}
        />
      )}
    </div>
  );
}

function ConfirmPurchaseModal({ tier, onConfirm, onCancel, purchasing }: { tier: TierWithCreator; onConfirm: () => void; onCancel: () => void; purchasing: boolean }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full shadow-2xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Confirm Purchase</h2>
          <p className="text-sm text-gray-600 mt-1">Review your membership details</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Membership</span>
              <span className="font-bold">{tier.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Creator</span>
              <span className="font-medium">{tier.creator.name}</span>
            </div>
            <div className="h-px bg-gray-600/50" />
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">{tier.duration_days} days</span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-600">Price</span>
              <span className="font-bold text-black">{tier.price_dot} DOT</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={purchasing}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={purchasing}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all shadow-sm"
            >
              {purchasing ? 'Processing...' : 'Confirm Purchase'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ tokenId, expiresAt, tierName, onClose }: { tokenId: string; expiresAt: Date; tierName: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-black max-w-md w-full shadow-2xl shadow-xl">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Purchase Successful!</h2>
          <p className="text-gray-600 mb-6">Your membership NFT has been minted</p>

          <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 space-y-3 text-left mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Membership</span>
              <span className="font-medium">{tierName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Token ID</span>
              <span className="font-mono text-xs text-black">{tokenId}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Expires</span>
              <span className="font-medium">{expiresAt.toLocaleDateString()}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
