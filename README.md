# Solana Seeker Wallet Expo Template

A clean, working Expo + React Native template for connecting to Solana Mobile Wallets (Seed Vault on Seeker) and checking Token-2022 NFT hold status.

## Features
- Mobile Wallet Adapter integration (authorize & pubkey extraction)
- Base64 → base58 pubkey decoding (handles Seed Vault format)
- Token-2022 group member NFT hold check (existence-based)
- Polyfills for Buffer & crypto.getRandomValues
- Loading states & error handling

## Setup

1. **Clone repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/solana-seeker-wallet-expo-template.git
   cd solana-seeker-wallet-expo-template
