/*
  # Seed Demo Data for FairPass Platform

  Populates the platform with realistic demo creators, membership tiers,
  active memberships, and marketplace listings to showcase the full functionality.

  1. Demo Creators
    - 6 diverse creators across different content types
    - Music artists, podcasters, educators, and content creators

  2. Membership Tiers
    - Multiple tiers per creator (Silver, Gold, Platinum)
    - Varied pricing from 5-100 DOT
    - Different durations (30, 90, 365 days)
    - Royalty percentages (5-15%)

  3. Sample Memberships
    - Pre-minted NFTs with realistic token IDs
    - Various expiration dates
    - Mix of active and near-expiry memberships

  4. Marketplace Listings
    - Active resale listings at different price points
    - Shows secondary market activity

  5. Transaction History
    - Sample mints, transfers, and sales
    - Demonstrates platform activity
*/

-- Insert Demo Creators
INSERT INTO creators (wallet_address, name, bio, avatar_url) VALUES
  ('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', 'Luna Eclipse', 'Independent electronic music producer creating ambient soundscapes and experimental beats. Supporting my music means supporting creative freedom.', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', 'TechTalk Daily', 'Daily tech news, reviews, and in-depth tutorials. Join our community to get early access to exclusive tech content and live Q&A sessions.', 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy', 'Maya Fitness', 'Certified personal trainer and nutrition coach. Transform your body and mind with science-based fitness programs and meal plans.', 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw', 'Crypto Canvas', 'Digital artist exploring the intersection of blockchain, AI, and traditional art. Exclusive NFT drops and behind-the-scenes content.', 'https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL', 'Web3 Academy', 'Learn blockchain development from scratch. Solidity, Rust, ink! smart contracts, and full-stack dApp development courses.', 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y', 'Gaming Legends', 'Pro gamer and streamer. Join for exclusive coaching sessions, tournament strategies, and behind-the-scenes pro gaming content.', 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400')
ON CONFLICT (wallet_address) DO NOTHING;

-- Insert Membership Tiers for Luna Eclipse
INSERT INTO membership_tiers (creator_id, name, description, price_dot, duration_days, royalty_percentage, max_supply) VALUES
  (
    (SELECT id FROM creators WHERE name = 'Luna Eclipse'),
    'Silver Wave',
    'Get access to my complete music library, including unreleased tracks and demos. Perfect for casual listeners who want to support independent music.',
    5.0,
    30,
    5,
    1000
  ),
  (
    (SELECT id FROM creators WHERE name = 'Luna Eclipse'),
    'Gold Frequency',
    'Everything in Silver plus early access to new releases, exclusive remixes, and stems for your own projects. Join the creative community.',
    15.0,
    90,
    10,
    500
  ),
  (
    (SELECT id FROM creators WHERE name = 'Luna Eclipse'),
    'Platinum Resonance',
    'The ultimate experience. Get personal feedback on your music, exclusive 1-on-1 sessions, and influence my creative direction.',
    50.0,
    365,
    15,
    100
  ),

  -- TechTalk Daily
  (
    (SELECT id FROM creators WHERE name = 'TechTalk Daily'),
    'Tech Insider',
    'Stay ahead of the curve with daily tech insights, reviews, and tutorials. Get the knowledge you need to level up your tech game.',
    8.0,
    30,
    5,
    2000
  ),
  (
    (SELECT id FROM creators WHERE name = 'TechTalk Daily'),
    'Tech Pro',
    'Deep dive into advanced tutorials, get early access to reviews, and join live Q&A sessions with industry experts.',
    25.0,
    90,
    10,
    800
  ),

  -- Maya Fitness
  (
    (SELECT id FROM creators WHERE name = 'Maya Fitness'),
    'Fitness Starter',
    'Begin your transformation with proven workout routines, meal plans, and motivational content. Perfect for beginners.',
    10.0,
    30,
    5,
    1500
  ),
  (
    (SELECT id FROM creators WHERE name = 'Maya Fitness'),
    'Elite Transform',
    'Advanced programs, personalized guidance, and accountability. For serious athletes ready to reach peak performance.',
    35.0,
    90,
    12,
    300
  ),

  -- Crypto Canvas
  (
    (SELECT id FROM creators WHERE name = 'Crypto Canvas'),
    'Art Collector',
    'Own exclusive digital art pieces and get behind-the-scenes access to my creative process. Limited edition NFTs included.',
    12.0,
    30,
    8,
    500
  ),
  (
    (SELECT id FROM creators WHERE name = 'Crypto Canvas'),
    'Gallery VIP',
    'Premium collector tier with rare 1/1 NFTs, private exhibitions, and direct collaboration opportunities with the artist.',
    75.0,
    365,
    15,
    50
  ),

  -- Web3 Academy
  (
    (SELECT id FROM creators WHERE name = 'Web3 Academy'),
    'Student Pass',
    'Access foundational Web3 development courses. Learn Solidity, smart contracts, and dApp development at your own pace.',
    20.0,
    90,
    7,
    1000
  ),
  (
    (SELECT id FROM creators WHERE name = 'Web3 Academy'),
    'Developer Pro',
    'Advanced courses in Rust, ink!, parachain development, and real-world project mentorship. Land your Web3 developer job.',
    100.0,
    365,
    12,
    200
  ),

  -- Gaming Legends
  (
    (SELECT id FROM creators WHERE name = 'Gaming Legends'),
    'Spectator',
    'Support the stream and get access to exclusive VODs, highlights, and behind-the-scenes content. Join the legend community.',
    7.0,
    30,
    5,
    3000
  ),
  (
    (SELECT id FROM creators WHERE name = 'Gaming Legends'),
    'Pro Trainee',
    'Level up your gameplay with personal coaching, strategy sessions, and tournament prep. Learn from a professional.',
    40.0,
    90,
    10,
    150
  )
ON CONFLICT DO NOTHING;

-- Insert Sample Memberships (Active NFTs owned by demo users)
INSERT INTO memberships (tier_id, owner_wallet, original_buyer_wallet, token_id, metadata_uri, expires_at, transfer_count) VALUES
  -- Luna Eclipse memberships
  (
    (SELECT id FROM membership_tiers WHERE name = 'Silver Wave' LIMIT 1),
    '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
    '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
    '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    'ipfs://QmX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q',
    (NOW() + INTERVAL '15 days')::timestamptz,
    0
  ),
  (
    (SELECT id FROM membership_tiers WHERE name = 'Gold Frequency' LIMIT 1),
    '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc',
    '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc',
    '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
    'ipfs://QmY2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R',
    (NOW() + INTERVAL '60 days')::timestamptz,
    0
  ),

  -- TechTalk Daily memberships
  (
    (SELECT id FROM membership_tiers WHERE name = 'Tech Insider' LIMIT 1),
    '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
    '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
    '0x3c4d5e6f7890abcdef1234567890abcdef123456',
    'ipfs://QmZ3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S',
    (NOW() + INTERVAL '20 days')::timestamptz,
    0
  ),
  (
    (SELECT id FROM membership_tiers WHERE name = 'Tech Pro' LIMIT 1),
    '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
    '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
    '0x4d5e6f7890abcdef1234567890abcdef12345678',
    'ipfs://QmA4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T',
    (NOW() + INTERVAL '75 days')::timestamptz,
    0
  ),

  -- Maya Fitness memberships
  (
    (SELECT id FROM membership_tiers WHERE name = 'Fitness Starter' LIMIT 1),
    '5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL',
    '5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL',
    '0x5e6f7890abcdef1234567890abcdef1234567890',
    'ipfs://QmB5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U',
    (NOW() + INTERVAL '25 days')::timestamptz,
    0
  ),

  -- Crypto Canvas memberships
  (
    (SELECT id FROM membership_tiers WHERE name = 'Art Collector' LIMIT 1),
    '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
    '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
    '0x6f7890abcdef1234567890abcdef12345678901a',
    'ipfs://QmC6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V',
    (NOW() + INTERVAL '18 days')::timestamptz,
    0
  ),

  -- Web3 Academy memberships
  (
    (SELECT id FROM membership_tiers WHERE name = 'Student Pass' LIMIT 1),
    '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    '0x7890abcdef1234567890abcdef12345678901abc',
    'ipfs://QmD7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W',
    (NOW() + INTERVAL '55 days')::timestamptz,
    0
  ),
  (
    (SELECT id FROM membership_tiers WHERE name = 'Developer Pro' LIMIT 1),
    '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    '0x890abcdef1234567890abcdef12345678901abcd',
    'ipfs://QmE8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X',
    (NOW() + INTERVAL '300 days')::timestamptz,
    0
  ),

  -- Gaming Legends memberships
  (
    (SELECT id FROM membership_tiers WHERE name = 'Spectator' LIMIT 1),
    '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
    '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
    '0x90abcdef1234567890abcdef12345678901abcde',
    'ipfs://QmF9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y',
    (NOW() + INTERVAL '12 days')::timestamptz,
    0
  )
ON CONFLICT DO NOTHING;

-- Insert Sample Transactions
INSERT INTO transactions (membership_id, from_wallet, to_wallet, transaction_type, price_dot, tx_hash) VALUES
  (
    (SELECT id FROM memberships WHERE token_id = '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12'),
    '0x0000000000000000000000000000000000000000',
    '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
    'mint',
    5.0,
    '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  ),
  (
    (SELECT id FROM memberships WHERE token_id = '0x2b3c4d5e6f7890abcdef1234567890abcdef1234'),
    '0x0000000000000000000000000000000000000000',
    '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc',
    'mint',
    15.0,
    '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678901'
  ),
  (
    (SELECT id FROM memberships WHERE token_id = '0x3c4d5e6f7890abcdef1234567890abcdef123456'),
    '0x0000000000000000000000000000000000000000',
    '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
    'mint',
    8.0,
    '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789012'
  ),
  (
    (SELECT id FROM memberships WHERE token_id = '0x4d5e6f7890abcdef1234567890abcdef12345678'),
    '0x0000000000000000000000000000000000000000',
    '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
    'mint',
    25.0,
    '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890123'
  )
ON CONFLICT DO NOTHING;

-- Insert Sample Marketplace Listings
INSERT INTO marketplace_listings (membership_id, seller_wallet, price_dot, is_active) VALUES
  (
    (SELECT id FROM memberships WHERE token_id = '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12'),
    '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
    6.5,
    true
  ),
  (
    (SELECT id FROM memberships WHERE token_id = '0x3c4d5e6f7890abcdef1234567890abcdef123456'),
    '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
    9.0,
    true
  )
ON CONFLICT DO NOTHING;
