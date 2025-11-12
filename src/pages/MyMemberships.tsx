import { useState, useEffect } from 'react';
import { Award, Clock, ExternalLink, RefreshCw, Tag, DollarSign } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { supabase, Membership } from '../lib/supabase';

type MembershipWithDetails = Membership & {
  tier: {
    name: string;
    price_dot: number;
    duration_days: number;
    creator: {
      name: string;
    };
  };
};

export function MyMemberships() {
  const { selectedAccount } = useWallet();
  const [memberships, setMemberships] = useState<MembershipWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showListingModal, setShowListingModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<MembershipWithDetails | null>(null);
  const [listingPrice, setListingPrice] = useState('');

  useEffect(() => {
    if (selectedAccount) {
      loadMemberships();
    }
  }, [selectedAccount]);

  const loadMemberships = async () => {
    if (!selectedAccount) return;

    const { data } = await supabase
      .from('memberships')
      .select(`
        *,
        tier:membership_tiers(
          name,
          price_dot,
          duration_days,
          creator:creators(name)
        )
      `)
      .eq('owner_wallet', selectedAccount.address)
      .order('minted_at', { ascending: false });

    if (data) {
      setMemberships(data.map(m => ({
        ...m,
        tier: {
          ...m.tier,
          creator: Array.isArray(m.tier.creator) ? m.tier.creator[0] : m.tier.creator
        }
      })));
    }
    setLoading(false);
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Expired';
  };

  const handleListForSale = (membership: MembershipWithDetails) => {
    setSelectedMembership(membership);
    setListingPrice(membership.tier.price_dot.toString());
    setShowListingModal(true);
  };

  const confirmListing = async () => {
    if (!selectedMembership || !selectedAccount) return;

    const price = parseFloat(listingPrice);
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .insert([{
          membership_id: selectedMembership.id,
          seller_wallet: selectedAccount.address,
          price_dot: price,
          is_active: true,
        }]);

      if (error) throw error;

      alert(`Membership listed for ${price} DOT!`);
      setShowListingModal(false);
      setSelectedMembership(null);
      setListingPrice('');
    } catch (error) {
      console.error('Listing failed:', error);
      alert('Failed to list membership. Please try again.');
    }
  };

  const handleRenew = async (membership: MembershipWithDetails) => {
    if (!selectedAccount) return;

    const confirmed = confirm(
      `Renew ${membership.tier.name} membership for ${membership.tier.price_dot} DOT?\n\nDuration: ${membership.tier.duration_days} days`
    );

    if (!confirmed) return;

    try {
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + membership.tier.duration_days);

      const { error } = await supabase
        .from('memberships')
        .update({
          expires_at: newExpiresAt.toISOString(),
        })
        .eq('id', membership.id);

      if (error) throw error;

      alert(`Membership renewed until ${newExpiresAt.toLocaleDateString()}!`);
      loadMemberships();
    } catch (error) {
      console.error('Renewal failed:', error);
      alert('Failed to renew membership. Please try again.');
    }
  };

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Award className="w-16 h-16 text-black mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your Polkadot wallet to view your memberships</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Memberships</h1>
            <p className="text-gray-600">Manage your creator memberships</p>
          </div>
          <button
            onClick={loadMemberships}
            className="px-4 py-2 bg-white hover:bg-slate-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : memberships.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You don't have any memberships yet</p>
            <a
              href="/marketplace"
              className="inline-block px-6 py-3 bg-black hover:bg-gray-800 rounded-lg font-semibold transition-colors"
            >
              Browse Marketplace
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberships.map((membership) => {
              const expired = isExpired(membership.expires_at);
              return (
                <div
                  key={membership.id}
                  className={`p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border transition-all ${
                    expired ? 'border-gray-200 opacity-60' : 'border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{membership.tier.name}</h3>
                      <p className="text-sm text-gray-600">by {membership.tier.creator.name}</p>
                    </div>
                    <Award className={`w-6 h-6 ${expired ? 'text-gray-500' : 'text-black'}`} />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Token ID</span>
                      <span className="font-mono text-xs">{membership.token_id.slice(0, 16)}...</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Minted</span>
                      <span>{new Date(membership.minted_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {expired ? 'Expired' : 'Expires'}
                      </span>
                      <span className={expired ? 'text-red-400' : 'text-black'}>
                        {expired ? new Date(membership.expires_at).toLocaleDateString() : getTimeRemaining(membership.expires_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!expired && (
                      <>
                        <button className="flex-1 px-4 py-2 bg-black hover:bg-gray-800 rounded-lg font-medium transition-colors text-sm">
                          Access Content
                        </button>
                        <button
                          onClick={() => handleListForSale(membership)}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors text-sm"
                          title="List for sale"
                        >
                          <Tag className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {expired && (
                      <button
                        onClick={() => handleRenew(membership)}
                        className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors text-sm"
                      >
                        Renew
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showListingModal && selectedMembership && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-slate-900 border border-gray-200 rounded-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">List Membership for Sale</h2>

              <div className="p-4 bg-white rounded-lg mb-6">
                <div className="text-sm text-gray-600 mb-1">Listing</div>
                <div className="font-bold text-lg">{selectedMembership.tier.name}</div>
                <div className="text-sm text-gray-600">{selectedMembership.tier.creator.name}</div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Sale Price (DOT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  placeholder="10.00"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 text-lg"
                  autoFocus
                />
                <div className="mt-2 text-xs text-gray-600">
                  Original price: {selectedMembership.tier.price_dot} DOT
                </div>
              </div>

              <div className="p-4 bg-black/10 border border-emerald-500/30 rounded-lg mb-6">
                <div className="text-sm text-black mb-1">Creator Royalty</div>
                <div className="text-xs text-gray-600">
                  The creator will receive {selectedMembership.tier.royalty_percentage}% ({(parseFloat(listingPrice || '0') * selectedMembership.tier.royalty_percentage / 100).toFixed(2)} DOT) from this sale
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmListing}
                  className="flex-1 px-6 py-3 bg-black hover:bg-gray-800 rounded-lg font-semibold transition-colors"
                >
                  List for Sale
                </button>
                <button
                  onClick={() => {
                    setShowListingModal(false);
                    setSelectedMembership(null);
                    setListingPrice('');
                  }}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
