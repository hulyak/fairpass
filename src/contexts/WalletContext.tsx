import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { getPolkadotAccounts } from '../lib/polkadot';

interface WalletContextType {
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | null;
  isConnected: boolean;
  isDemoMode: boolean;
  connect: () => Promise<void>;
  connectDemoMode: () => void;
  disconnect: () => void;
  selectAccount: (account: InjectedAccountWithMeta) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const connect = async () => {
    try {
      const accs = await getPolkadotAccounts();
      setAccounts(accs);
      if (accs.length > 0) {
        setSelectedAccount(accs[0]);
        setIsConnected(true);
        localStorage.setItem('wallet_connected', 'true');
        localStorage.setItem('selected_wallet', accs[0].address);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const connectDemoMode = () => {
    const demoAccount: InjectedAccountWithMeta = {
      address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      meta: {
        name: 'Demo Account',
        source: 'demo',
      },
      type: 'sr25519',
    };
    setAccounts([demoAccount]);
    setSelectedAccount(demoAccount);
    setIsConnected(true);
    setIsDemoMode(true);
    localStorage.setItem('wallet_connected', 'demo');
    localStorage.setItem('selected_wallet', demoAccount.address);
  };

  const disconnect = () => {
    setAccounts([]);
    setSelectedAccount(null);
    setIsConnected(false);
    setIsDemoMode(false);
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('selected_wallet');
  };

  const selectAccount = (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account);
    localStorage.setItem('selected_wallet', account.address);
  };

  useEffect(() => {
    const wasConnected = localStorage.getItem('wallet_connected');
    if (wasConnected === 'demo') {
      connectDemoMode();
    } else if (wasConnected === 'true') {
      connect().catch(console.error);
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        accounts,
        selectedAccount,
        isConnected,
        isDemoMode,
        connect,
        connectDemoMode,
        disconnect,
        selectAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
