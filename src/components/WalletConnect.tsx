import { useState, useEffect } from 'react';
import { Wallet, ChevronDown, LogOut, AlertCircle, Download, X } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { formatAddress, getAccountBalance } from '../lib/polkadot';

export function WalletConnect() {
  const { accounts, selectedAccount, isConnected, isDemoMode, connect, connectDemoMode, disconnect, selectAccount } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [balance, setBalance] = useState<string>('0.0000');
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    if (selectedAccount && !isDemoMode) {
      setLoadingBalance(true);
      getAccountBalance(selectedAccount.address)
        .then(setBalance)
        .finally(() => setLoadingBalance(false));
    } else if (isDemoMode) {
      setBalance('100.0000');
    }
  }, [selectedAccount, isDemoMode]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error('Wallet connection error:', error);
      setShowInstallModal(true);
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isConnected) {
    return (
      <>
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="px-5 py-2.5 bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
        >
          <Wallet className="w-4 h-4" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>

        {showInstallModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white border border-gray-300 rounded-2xl p-8 max-w-lg w-full relative shadow-2xl">
              <button
                onClick={() => setShowInstallModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <AlertCircle className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-black">Polkadot.js Extension Required</h2>
                  <p className="text-gray-600">
                    To use FairPass, you need to install the Polkadot.js browser extension. This is your wallet for managing memberships on the Polkadot network.
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-slate-800 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-sm">1</span>
                    Install the Extension
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">
                    Download and install the Polkadot.js extension for your browser
                  </p>
                  <div className="flex gap-2">
                    <a
                      href="https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Chrome
                    </a>
                    <a
                      href="https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Firefox
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-slate-800 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-sm">2</span>
                    Create or Import Account
                  </h3>
                  <p className="text-sm text-slate-400">
                    After installation, create a new Polkadot account or import an existing one using your seed phrase
                  </p>
                </div>

                <div className="p-4 bg-slate-800 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-sm">3</span>
                    Connect to FairPass
                  </h3>
                  <p className="text-sm text-slate-400">
                    Refresh this page and click "Connect Wallet" to authorize FairPass to access your Polkadot account
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg mb-6">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Want to try without installing?</strong> Use demo mode to explore FairPass with a simulated wallet.
                </p>
                <button
                  onClick={() => {
                    connectDemoMode();
                    setShowInstallModal(false);
                  }}
                  className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Use Demo Mode
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-lg font-medium transition-colors flex items-center gap-2 text-sm border border-gray-300"
      >
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:inline font-mono text-xs">{formatAddress(selectedAccount?.address || '')}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600 font-medium">Connected Wallet</div>
              {isDemoMode && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Demo</span>
              )}
            </div>
            <div className="text-sm font-semibold text-black mb-2">{selectedAccount?.meta.name || 'Account'}</div>
            <div className="text-xs text-gray-500 font-mono mb-3 break-all">{selectedAccount?.address}</div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-600">Balance:</span>
              <span className="text-sm font-bold text-black">
                {loadingBalance ? '...' : `${balance} WND`}
              </span>
            </div>
          </div>

          {accounts.length > 1 && (
            <div className="p-2 border-b border-gray-200">
              <div className="text-xs text-gray-600 mb-2 px-2 font-medium">Switch Account</div>
              {accounts.map((account) => (
                <button
                  key={account.address}
                  onClick={() => {
                    selectAccount(account);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedAccount?.address === account.address
                      ? 'bg-gray-100 text-black border border-gray-300'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="text-sm font-medium">{account.meta.name || 'Account'}</div>
                  <div className="text-xs text-gray-500 font-mono">{formatAddress(account.address)}</div>
                </button>
              ))}
            </div>
          )}

          <div className="p-2">
            <button
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
