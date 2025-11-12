import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN } from '@polkadot/util';

const APP_NAME = 'FairPass';
const WESTEND_RPC = 'wss://westend-rpc.polkadot.io';

export async function enablePolkadotExtension(): Promise<boolean> {
  const extensions = await web3Enable(APP_NAME);
  return extensions.length > 0;
}

export async function getPolkadotAccounts(): Promise<InjectedAccountWithMeta[]> {
  const enabled = await enablePolkadotExtension();
  if (!enabled) {
    throw new Error('Polkadot extension not found. Please install Polkadot.js extension.');
  }
  const accounts = await web3Accounts();
  return accounts;
}

export async function signTransaction(address: string, payload: string): Promise<string> {
  const injector = await web3FromAddress(address);
  if (!injector.signer.signRaw) {
    throw new Error('Signer does not support raw signing');
  }
  const result = await injector.signer.signRaw({
    address,
    data: payload,
    type: 'bytes',
  });
  return result.signature;
}

export function formatAddress(address: string): string {
  if (address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function generateMockTokenId(): string {
  return `FP-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`.toUpperCase();
}

export function generateMockTxHash(): string {
  return `0x${Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;
}

let apiInstance: ApiPromise | null = null;

export async function getPolkadotApi(): Promise<ApiPromise> {
  if (apiInstance && apiInstance.isConnected) {
    return apiInstance;
  }

  const provider = new WsProvider(WESTEND_RPC);
  apiInstance = await ApiPromise.create({ provider });
  return apiInstance;
}

export async function disconnectApi(): Promise<void> {
  if (apiInstance) {
    await apiInstance.disconnect();
    apiInstance = null;
  }
}

export async function getAccountBalance(address: string): Promise<string> {
  try {
    const api = await getPolkadotApi();
    const { data: balance } = await api.query.system.account(address);
    const free = balance.free.toString();
    const formatted = (Number(free) / 1e12).toFixed(4);
    return formatted;
  } catch (error) {
    console.error('Failed to get balance:', error);
    return '0.0000';
  }
}

export async function transferDOT(
  fromAddress: string,
  toAddress: string,
  amount: string
): Promise<string> {
  const api = await getPolkadotApi();
  const injector = await web3FromAddress(fromAddress);

  const amountBN = new BN(amount).mul(new BN(10).pow(new BN(12)));

  const transfer = api.tx.balances.transferKeepAlive(toAddress, amountBN);

  return new Promise((resolve, reject) => {
    transfer
      .signAndSend(fromAddress, { signer: injector.signer }, ({ status, txHash }) => {
        if (status.isInBlock) {
          resolve(txHash.toString());
        }
      })
      .catch(reject);
  });
}

export interface MembershipNFTMetadata {
  tierId: string;
  tierName: string;
  creatorName: string;
  durationDays: number;
  expiresAt: string;
}

export async function mintMembershipNFT(
  ownerAddress: string,
  metadata: MembershipNFTMetadata
): Promise<{ tokenId: string; txHash: string }> {
  const tokenId = generateMockTokenId();
  const txHash = generateMockTxHash();

  console.log('Minting NFT with metadata:', metadata);
  console.log('Owner:', ownerAddress);
  console.log('Token ID:', tokenId);

  return { tokenId, txHash };
}
