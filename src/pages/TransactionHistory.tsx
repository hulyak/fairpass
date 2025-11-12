import { useState, useEffect } from 'react';
import { History, ArrowUpRight, ArrowDownLeft, RefreshCcw, Sparkles } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { supabase, Transaction } from '../lib/supabase';
import { formatAddress } from '../lib/polkadot';

type TransactionWithDetails = Transaction & {
  membership: {
    token_id: string;
    tier: {
      name: string;
      creator: {
        name: string;
      };
    };
  };
};

export function TransactionHistory() {
  const { selectedAccount } = useWallet();
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mint' | 'transfer' | 'renewal' | 'sale'>('all');

  useEffect(() => {
    if (selectedAccount) {
      loadTransactions();
    }
  }, [selectedAccount, filter]);

  const loadTransactions = async () => {
    if (!selectedAccount) return;

    let query = supabase
      .from('transactions')
      .select(`
        *,
        membership:memberships(
          token_id,
          tier:membership_tiers(
            name,
            creator:creators(name)
          )
        )
      `)
      .or(`from_wallet.eq.${selectedAccount.address},to_wallet.eq.${selectedAccount.address}`)
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('transaction_type', filter);
    }

    const { data } = await query;

    if (data) {
      const formattedData = data
        .filter(tx => tx.membership)
        .map(tx => ({
          ...tx,
          membership: {
            ...tx.membership,
            tier: {
              ...tx.membership.tier,
              creator: Array.isArray(tx.membership.tier.creator)
                ? tx.membership.tier.creator[0]
                : tx.membership.tier.creator
            }
          }
        }));
      setTransactions(formattedData);
    }
    setLoading(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'mint':
        return <Sparkles className="w-5 h-5 text-black" />;
      case 'transfer':
        return <ArrowUpRight className="w-5 h-5 text-blue-400" />;
      case 'renewal':
        return <RefreshCcw className="w-5 h-5 text-purple-400" />;
      case 'sale':
        return <ArrowDownLeft className="w-5 h-5 text-yellow-400" />;
      default:
        return <History className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'mint':
        return 'border-emerald-500/30 bg-black/5';
      case 'transfer':
        return 'border-blue-500/30 bg-blue-500/5';
      case 'renewal':
        return 'border-purple-500/30 bg-purple-500/5';
      case 'sale':
        return 'border-yellow-500/30 bg-yellow-500/5';
      default:
        return 'border-gray-200';
    }
  };

  const isIncoming = (tx: Transaction) => {
    return tx.to_wallet === selectedAccount?.address;
  };

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <History className="w-16 h-16 text-black mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your Polkadot wallet to view your transaction history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Transaction History</h1>
            <p className="text-gray-600">All your membership transactions on-chain</p>
          </div>
          <button
            onClick={loadTransactions}
            className="px-4 py-2 bg-white hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'mint', 'transfer', 'renewal', 'sale'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === f
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className={`p-6 rounded-xl border transition-all ${getTransactionColor(tx.transaction_type)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    {getTransactionIcon(tx.transaction_type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold mb-1">
                          {tx.transaction_type.charAt(0).toUpperCase() + tx.transaction_type.slice(1)} -{' '}
                          {tx.membership.tier.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          by {tx.membership.tier.creator.name}
                        </p>
                      </div>
                      {tx.price_dot && (
                        <div className="text-right">
                          <div className={`text-xl font-bold ${isIncoming(tx) ? 'text-black' : 'text-gray-700'}`}>
                            {isIncoming(tx) ? '+' : '-'}{tx.price_dot} DOT
                          </div>
                          <div className="text-xs text-gray-600">
                            {isIncoming(tx) ? 'Received' : 'Paid'}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">Token ID</div>
                        <div className="font-mono text-xs">{tx.membership.token_id.slice(0, 16)}...</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">From</div>
                        <div className="font-mono text-xs">{formatAddress(tx.from_wallet)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">To</div>
                        <div className="font-mono text-xs">{formatAddress(tx.to_wallet)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Date</div>
                        <div>{new Date(tx.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">Transaction Hash</div>
                        <a
                          href={`https://polkadot.js.org/apps/#/explorer/query/${tx.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-black hover:text-emerald-300 transition-colors"
                        >
                          {tx.tx_hash.slice(0, 12)}...{tx.tx_hash.slice(-8)}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
