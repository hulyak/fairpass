import { useState, useEffect } from 'react';
import { User, Award, TrendingUp, Users, Calendar, Edit } from 'lucide-react';
import { supabase, Creator, MembershipTier } from '../lib/supabase';
import { formatAddress } from '../lib/polkadot';

type CreatorWithStats = Creator & {
  stats: {
    totalMembers: number;
    activeTiers: number;
    totalRevenue: number;
  };
};

export function CreatorProfile({ creatorId, onBack }: { creatorId: string; onBack: () => void }) {
  const [creator, setCreator] = useState<CreatorWithStats | null>(null);
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCreatorProfile();
  }, [creatorId]);

  const loadCreatorProfile = async () => {
    const { data: creatorData } = await supabase
      .from('creators')
      .select('*')
      .eq('id', creatorId)
      .single();

    if (!creatorData) {
      setLoading(false);
      return;
    }

    const { data: tiersData } = await supabase
      .from('membership_tiers')
      .select('*')
      .eq('creator_id', creatorId)
      .eq('is_active', true)
      .order('price_dot', { ascending: true });

    const tierIds = tiersData?.map(t => t.id) || [];
    let totalMembers = 0;
    let totalRevenue = 0;

    if (tierIds.length > 0) {
      const { count } = await supabase
        .from('memberships')
        .select('*', { count: 'exact', head: true })
        .in('tier_id', tierIds)
        .gt('expires_at', new Date().toISOString());

      totalMembers = count || 0;

      const { data: membershipIds } = await supabase
        .from('memberships')
        .select('id')
        .in('tier_id', tierIds);

      if (membershipIds) {
        const { data: transactions } = await supabase
          .from('transactions')
          .select('price_dot')
          .in('membership_id', membershipIds.map(m => m.id));

        totalRevenue = transactions?.reduce((sum, t) => sum + (t.price_dot || 0), 0) || 0;
      }
    }

    setCreator({
      ...creatorData,
      stats: {
        totalMembers,
        activeTiers: tiersData?.length || 0,
        totalRevenue,
      },
    });

    setTiers(tiersData || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Creator not found</p>
          <button onClick={onBack} className="px-6 py-2 bg-black hover:bg-gray-800 rounded-lg font-medium transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-white hover:bg-slate-700 rounded-lg font-medium transition-colors"
        >
          ← Back
        </button>

        <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-gray-200 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
              {creator.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{creator.name}</h1>
                  <p className="text-gray-600 mb-2">{creator.bio || 'No bio provided'}</p>
                  <p className="text-sm text-gray-600 font-mono">{formatAddress(creator.wallet_address)}</p>
                </div>
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="p-4 bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-black" />
                    <span className="text-2xl font-bold">{creator.stats.totalMembers}</span>
                  </div>
                  <div className="text-sm text-gray-600">Active Members</div>
                </div>

                <div className="p-4 bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-black" />
                    <span className="text-2xl font-bold">{creator.stats.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-600">Total Revenue (DOT)</div>
                </div>

                <div className="p-4 bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-black" />
                    <span className="text-2xl font-bold">{creator.stats.activeTiers}</span>
                  </div>
                  <div className="text-sm text-gray-600">Active Tiers</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Membership Tiers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-gray-200 hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                  <Award className="w-8 h-8 text-black" />
                </div>

                <p className="text-slate-300 text-sm mb-6">{tier.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price</span>
                    <span className="font-bold text-black">{tier.price_dot} DOT</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Duration
                    </span>
                    <span className="font-medium">{tier.duration_days} days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Royalty</span>
                    <span className="font-medium">{tier.royalty_percentage}%</span>
                  </div>
                </div>

                <button className="w-full px-6 py-3 bg-black hover:bg-gray-800 rounded-lg font-semibold transition-colors">
                  Purchase
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
