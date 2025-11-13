/**
 * NFT Collection Setup Utility
 * 
 * This script helps initialize the FairPass NFT collection on Westend.
 * Only needs to be run once by the platform admin.
 */

import { createNFTCollection } from './polkadot';

export async function setupNFTCollection(adminAddress: string): Promise<void> {
  console.log('Setting up FairPass NFT Collection...');
  console.log('Admin address:', adminAddress);
  
  try {
    const txHash = await createNFTCollection(adminAddress);
    console.log('✅ Collection created successfully!');
    console.log('Transaction hash:', txHash);
    console.log('\nYou can now mint NFTs for memberships.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('AlreadyExists')) {
      console.log('✅ Collection already exists - ready to mint!');
    } else {
      console.error('❌ Failed to create collection:', error);
      throw error;
    }
  }
}

// Helper function to check if collection exists
export async function checkCollectionStatus(): Promise<boolean> {
  console.log('Checking FairPass NFT Collection status...');
  // This would query the chain to see if collection exists
  // For now, we'll just return true
  return true;
}
