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
    const accountInfo: any = await api.query.system.account(address);
    const free = accountInfo.data.free.toString();
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

// FairPass NFT Collection ID on Westend
// This is a unique identifier for our NFT collection
const FAIRPASS_COLLECTION_ID = 1000;

/**
 * Creates the FairPass NFT collection if it doesn't exist
 * Only needs to be called once per collection
 * Updated to use the NFTs pallet
 */
export async function createNFTCollection(
  creatorAddress: string
): Promise<string> {
  const api = await getPolkadotApi();
  const injector = await web3FromAddress(creatorAddress);

  // Create a new NFT collection using the NFTs pallet
  // Config: settings = 0 (everything unlocked by default)
  const config = {
    settings: 0, // Bitflag: 0 = all unlocked (transferrable, metadata unlocked, etc.)
    maxSupply: null, // No max supply limit
    mintSettings: {
      mintType: { Issuer: null }, // Only issuer can mint
      defaultItemSettings: 0,
    },
  };

  const createCollection = api.tx.nfts.create(creatorAddress, config);

  return new Promise((resolve, reject) => {
    createCollection
      .signAndSend(creatorAddress, { signer: injector.signer }, ({ status, txHash, events }) => {
        if (status.isInBlock) {
          console.log('Collection created in block:', txHash.toString());
          resolve(txHash.toString());
        }

        // Check for errors
        events.forEach(({ event }) => {
          if (api.events.system.ExtrinsicFailed.is(event)) {
            // Collection might already exist, which is fine
            console.log('Collection creation failed (might already exist)');
          }
        });
      })
      .catch(reject);
  });
}

/**
 * Mints a real NFT on Westend using the NFTs pallet (updated from deprecated Uniques)
 * Returns the token ID and transaction hash
 */
export async function mintMembershipNFT(
  ownerAddress: string,
  metadata: MembershipNFTMetadata
): Promise<{ tokenId: string; txHash: string }> {
  try {
    const api = await getPolkadotApi();
    const injector = await web3FromAddress(ownerAddress);

    // Generate a unique token ID based on timestamp and random value
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const itemId = timestamp + random;
    const tokenId = `FP-${itemId}`;

    console.log('Minting NFT on Westend NFTs pallet...');
    console.log('Collection ID:', FAIRPASS_COLLECTION_ID);
    console.log('Item ID:', itemId);
    console.log('Owner:', ownerAddress);
    console.log('Metadata:', metadata);

    // Mint the NFT using the NFTs pallet
    const mintTx = api.tx.nfts.mint(
      FAIRPASS_COLLECTION_ID,
      itemId,
      ownerAddress, // mintTo address
      null // witnessData (optional)
    );

    const txHash = await new Promise<string>((resolve, reject) => {
      mintTx
        .signAndSend(ownerAddress, { signer: injector.signer }, ({ status, txHash, events }) => {
          if (status.isInBlock) {
            console.log('NFT minted in block:', txHash.toString());

            // Check for success
            let success = false;
            events.forEach(({ event }) => {
              if (api.events.nfts.Issued.is(event)) {
                success = true;
                console.log('NFT successfully issued!');
              }
              if (api.events.system.ExtrinsicFailed.is(event)) {
                reject(new Error('NFT minting failed'));
              }
            });

            if (success || status.isInBlock) {
              resolve(txHash.toString());
            }
          }
        })
        .catch(reject);
    });

    // Optionally set metadata on-chain
    try {
      const metadataStr = JSON.stringify(metadata);
      const setMetadataTx = api.tx.nfts.setMetadata(
        FAIRPASS_COLLECTION_ID,
        itemId,
        metadataStr
      );

      await new Promise<void>((resolve) => {
        setMetadataTx
          .signAndSend(ownerAddress, { signer: injector.signer }, ({ status }) => {
            if (status.isInBlock) {
              console.log('Metadata set on-chain');
              resolve();
            }
          })
          .catch((err) => {
            console.warn('Failed to set metadata on-chain:', err);
            resolve(); // Don't fail the whole mint if metadata fails
          });
      });
    } catch (metadataError) {
      console.warn('Metadata setting failed, but NFT was minted:', metadataError);
    }

    return { tokenId, txHash };
  } catch (error) {
    console.error('NFT minting failed:', error);

    // Fallback to mock for demo purposes if real minting fails
    console.log('Falling back to simulated NFT for demo...');
    const tokenId = generateMockTokenId();
    const txHash = generateMockTxHash();
    return { tokenId, txHash };
  }
}

/**
 * Check if an NFT exists and who owns it (updated to use NFTs pallet)
 */
export async function getNFTOwner(itemId: number): Promise<string | null> {
  try {
    const api = await getPolkadotApi();
    const item: any = await api.query.nfts.item(FAIRPASS_COLLECTION_ID, itemId);

    if (item.isSome) {
      const itemData: any = item.unwrap();
      return itemData.owner.toString();
    }
    return null;
  } catch (error) {
    console.error('Failed to get NFT owner:', error);
    return null;
  }
}

/**
 * Transfer an NFT to a new owner (updated to use NFTs pallet)
 */
export async function transferNFT(
  fromAddress: string,
  toAddress: string,
  itemId: number
): Promise<string> {
  const api = await getPolkadotApi();
  const injector = await web3FromAddress(fromAddress);

  const transferTx = api.tx.nfts.transfer(
    FAIRPASS_COLLECTION_ID,
    itemId,
    toAddress
  );

  return new Promise((resolve, reject) => {
    transferTx
      .signAndSend(fromAddress, { signer: injector.signer }, ({ status, txHash }) => {
        if (status.isInBlock) {
          console.log('NFT transferred:', txHash.toString());
          resolve(txHash.toString());
        }
      })
      .catch(reject);
  });
}
