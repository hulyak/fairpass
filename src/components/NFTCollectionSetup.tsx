import { useState } from 'react';
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { createNFTCollection } from '../lib/polkadot';

export function NFTCollectionSetup() {
  const { selectedAccount, isDemoMode } = useWallet();
  const [status, setStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSetup = async () => {
    if (!selectedAccount || isDemoMode) return;

    setStatus('creating');
    setErrorMessage('');

    try {
      await createNFTCollection(selectedAccount.address);
      setStatus('success');
    } catch (error) {
      console.error('Collection setup failed:', error);
      
      // Check if collection already exists
      if (error instanceof Error && error.message.includes('AlreadyExists')) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  };

  if (isDemoMode) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">Demo Mode Active</h3>
            <p className="text-sm text-yellow-700">
              NFT collection setup requires a real Polkadot wallet. Connect with Polkadot.js extension to enable real NFT minting.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 mb-1">Collection Ready!</h3>
            <p className="text-sm text-green-700">
              The FairPass NFT collection is set up and ready to mint membership NFTs on Westend.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">NFT Collection Setup</h3>
          <p className="text-sm text-gray-600 mb-4">
            Initialize the FairPass NFT collection on Westend to enable real on-chain membership NFTs. 
            This only needs to be done once.
          </p>
          
          {status === 'error' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <strong>Error:</strong> {errorMessage}
            </div>
          )}

          <button
            onClick={handleSetup}
            disabled={!selectedAccount || status === 'creating'}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {status === 'creating' ? 'Creating Collection...' : 'Initialize Collection'}
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Note: This will create a transaction on Westend testnet. Make sure you have WND tokens.
          </p>
        </div>
      </div>
    </div>
  );
}
