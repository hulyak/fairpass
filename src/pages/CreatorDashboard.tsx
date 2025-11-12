import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Users, DollarSign, Award, X } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { supabase, Creator, MembershipTier } from '../lib/supabase';

export function CreatorDashboard() {
  const { selectedAccount } = useWallet();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [showTierForm, setShowTierForm] = useState(false);
  const [stats, setStats] = useState({ totalMembers: 0, revenue: 0, activeTiers: 0 });
  const [loading, setLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    if (selectedAccount) {
      loadCreatorData();
    } else {
      setLoading(false);
    }
  }, [selectedAccount]);

  const loadCreatorData = async () => {
    if (!selectedAccount) return;

    setLoading(true);
    const { data: creatorData } = await supabase
      .from('creators')
      .select('*')
      .eq('wallet_address', selectedAccount.address)
      .maybeSingle();

    if (creatorData) {
      setCreator(creatorData);
      loadTiers(creatorData.id);
      loadStats(creatorData.id);
    }
    setLoading(false);
  };

  const loadTiers = async (creatorId: string) => {
    const { data } = await supabase
      .from('membership_tiers')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (data) setTiers(data);
  };

  const loadStats = async (creatorId: string) => {
    const { data: tierIds } = await supabase
      .from('membership_tiers')
      .select('id')
      .eq('creator_id', creatorId);

    if (tierIds && tierIds.length > 0) {
      const tierIdList = tierIds.map(t => t.id);

      const { count } = await supabase
        .from('memberships')
        .select('*', { count: 'exact', head: true })
        .in('tier_id', tierIdList)
        .gt('expires_at', new Date().toISOString());

      const { data: transactions } = await supabase
        .from('transactions')
        .select('price_dot')
        .in('membership_id',
          (await supabase.from('memberships').select('id').in('tier_id', tierIdList)).data?.map(m => m.id) || []
        );

      const revenue = transactions?.reduce((sum, t) => sum + (t.price_dot || 0), 0) || 0;

      setStats({
        totalMembers: count || 0,
        revenue,
        activeTiers: tiers.filter(t => t.is_active).length,
      });
    }
  };

  const createProfile = async (name: string, bio: string, avatarUrl: string) => {
    if (!selectedAccount) return;

    const { data, error } = await supabase
      .from('creators')
      .insert([{
        wallet_address: selectedAccount.address,
        name,
        bio,
        avatar_url: avatarUrl,
      }])
      .select()
      .single();

    if (error) {
      alert('Error creating profile: ' + error.message);
      return false;
    } else {
      setCreator(data);
      setShowProfileForm(false);
      return true;
    }
  };

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Award className="w-16 h-16 text-black mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your Polkadot wallet to access the creator dashboard</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading creator dashboard...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Become a Creator</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Start your journey on FairPass. Create membership tiers, build your community, and earn without platform fees.
          </p>
          <button
            onClick={() => setShowProfileForm(true)}
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-sm"
          >
            Create Your Profile
          </button>
          <p className="text-xs text-gray-600 mt-4">
            Connect your wallet to get started
          </p>
        </div>

        {showProfileForm && (
          <ProfileFormModal
            onSubmit={createProfile}
            onCancel={() => setShowProfileForm(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {creator.avatar_url && (
              <img
                src={creator.avatar_url}
                alt={creator.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-black"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold">{creator.name}</h1>
              <p className="text-gray-600">Creator Dashboard</p>
            </div>
          </div>
          {creator.bio && (
            <p className="text-gray-700 max-w-2xl">{creator.bio}</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-black transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-black" />
              </div>
              <span className="text-3xl font-bold">{stats.totalMembers}</span>
            </div>
            <div className="text-gray-600 text-sm">Active Members</div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-black transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-black" />
              </div>
              <span className="text-3xl font-bold">{stats.revenue.toFixed(2)}</span>
            </div>
            <div className="text-gray-600 text-sm">Total Revenue (DOT)</div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-black transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <span className="text-3xl font-bold">{stats.activeTiers}</span>
            </div>
            <div className="text-gray-600 text-sm">Active Tiers</div>
          </div>
        </div>

        <div className="bg-white/50 rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Membership Tiers</h2>
            <button
              onClick={() => setShowTierForm(!showTierForm)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-sm hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Create Tier
            </button>
          </div>

          {showTierForm && (
            <TierForm
              creatorId={creator.id}
              onSuccess={() => {
                setShowTierForm(false);
                loadTiers(creator.id);
              }}
              onCancel={() => setShowTierForm(false)}
            />
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="p-5 bg-white rounded-lg border border-gray-200 hover:border-black transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${tier.is_active ? 'bg-black/20 text-black' : 'bg-gray-600 text-gray-600'}`}>
                    {tier.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-black">{tier.price_dot} DOT</div>
                    <div className="text-xs text-gray-600">{tier.duration_days} days</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{tier.royalty_percentage}%</div>
                    <div className="text-xs text-gray-600">Royalty</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {tiers.length === 0 && !showTierForm && (
            <div className="text-center py-12 text-gray-600">
              No membership tiers created yet. Click "Create Tier" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TierForm({ creatorId, onSuccess, onCancel }: { creatorId: string; onSuccess: () => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_dot: '',
    duration_days: '',
    royalty_percentage: '10',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('membership_tiers')
      .insert([{
        creator_id: creatorId,
        name: formData.name,
        description: formData.description,
        price_dot: parseFloat(formData.price_dot),
        duration_days: parseInt(formData.duration_days),
        royalty_percentage: parseFloat(formData.royalty_percentage),
        is_active: true,
      }]);

    if (error) {
      alert('Error creating tier: ' + error.message);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg border border-gray-200 mb-6">
      <h3 className="text-xl font-bold mb-4">Create New Membership Tier</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tier Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Bronze, Silver, Gold"
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Price (DOT)</label>
          <input
            type="number"
            step="0.01"
            value={formData.price_dot}
            onChange={(e) => setFormData({ ...formData, price_dot: e.target.value })}
            placeholder="10.00"
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Duration (Days)</label>
          <input
            type="number"
            value={formData.duration_days}
            onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
            placeholder="30"
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Royalty %</label>
          <input
            type="number"
            step="0.1"
            value={formData.royalty_percentage}
            onChange={(e) => setFormData({ ...formData, royalty_percentage: e.target.value })}
            placeholder="10"
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the benefits of this tier..."
          rows={3}
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
          required
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Create Tier
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ProfileFormModal({ onSubmit, onCancel }: { onSubmit: (name: string, bio: string, avatarUrl: string) => Promise<boolean | undefined>; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatarUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await onSubmit(formData.name, formData.bio, formData.avatarUrl);
    setSubmitting(false);
    if (success) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-lg w-full shadow-2xl shadow-lg animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Create Your Profile</h2>
            <p className="text-sm text-gray-600 mt-1">Tell the community about yourself</p>
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-lg bg-gray-600/50 hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Creator Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Luna Eclipse, TechTalk Daily"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell fans what you create and why they should support you..."
              rows={4}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Avatar URL</label>
            <input
              type="url"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://example.com/your-photo.jpg"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            <p className="text-xs text-gray-600 mt-1.5">Optional: Link to your profile photo</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.name}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg font-semibold transition-all shadow-sm disabled:shadow-none"
            >
              {submitting ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
