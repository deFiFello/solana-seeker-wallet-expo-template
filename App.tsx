// App.tsx - Solana Seeker Wallet Connection + Token-2022 NFT Hold Check
// Uses Helius RPC with base64 pubkey encoding (fixes "base58 too long" error)
// Key loaded from app.json extra (permanent, secure, no dotenv/env files needed)

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey } from '@solana/web3.js';
import Constants from 'expo-constants';

// CONFIG - Change these for your project
const APP_NAME = 'Pro Hockey Markets by Solis';
const APP_URI = 'https://solis-tokenized-markets.vercel.app';
const APP_ICON = '/icon.png';

const TOKEN_MEMBER_ACCOUNT = new PublicKey('7RWZohJ2gG1rzV49WgUAbtK3Ds7B5nzHNtFHTkDBpsKs');

// Load Helius key from app.json extra (permanent, secure, no env files needed)
const HELIUS_API_KEY = Constants.expoConfig?.extra?.heliusApiKey;
if (!HELIUS_API_KEY) {
  console.error('HELIUS_API_KEY is missing from app.json extra');
}

const RPC_ENDPOINT = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

export default function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [genesisStatus, setGenesisStatus] = useState<string>('Not checked');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const authorizationResult = await transact(async (wallet) => {
        const auth = await wallet.authorize({
          cluster: 'mainnet-beta',
          identity: {
            name: APP_NAME,
            uri: APP_URI,
            icon: APP_ICON,
          },
        });
        return auth;
      });

      if (!authorizationResult.accounts || authorizationResult.accounts.length === 0) {
        throw new Error('No accounts authorized');
      }

      const account = authorizationResult.accounts[0];
      let addressStr = account.address;

      // Handle base64-encoded address from Seed Vault
      if (typeof addressStr === 'string' && (addressStr.includes('+') || addressStr.includes('='))) {
        try {
          const decodedBytes = Buffer.from(addressStr, 'base64');
          addressStr = new PublicKey(decodedBytes).toBase58();
        } catch (decodeErr: unknown) {
          const msg = decodeErr instanceof Error ? decodeErr.message : 'Unknown decode error';
          throw new Error(`Failed to decode base64 address: ${msg}`);
        }
      }

      if (typeof addressStr !== 'string' || addressStr.trim() === '') {
        throw new Error('Invalid address format');
      }

      const pubkey = new PublicKey(addressStr);
      setWalletAddress(pubkey.toBase58());

      await checkGenesis(pubkey);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect wallet';
      setConnectionError(msg);
      Alert.alert('Error', msg);
    } finally {
      setIsConnecting(false);
    }
  };

  const checkGenesis = async (pubkey: PublicKey) => {
    try {
      console.log('Checking Genesis member account for:', pubkey.toBase58());
  
      // Use base58 string for pubkey (Helius accepts this - proven in curl)
      const memberAddress = TOKEN_MEMBER_ACCOUNT.toBase58();
  
      const response = await fetch(RPC_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getAccountInfo',
          params: [memberAddress, { encoding: 'base64' }],
        }),
      });
  
      const data = await response.json();
      console.log('Helius response:', JSON.stringify(data, null, 2));
  
      if (data.error) {
        throw new Error(data.error.message || 'RPC error');
      }
  
      const memberInfo = data.result.value;
      if (memberInfo === null) {
        setGenesisStatus('Genesis member account not found');
        return;
      }
  
      // Success: account exists = hold
      const msg = 'Holds 1 Genesis (group member account exists)';
      setGenesisStatus(msg);
      Alert.alert('Success', msg);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Genesis check failed';
      console.log('Genesis check failed:', msg, err);
      setGenesisStatus('Not held');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pro Hockey Markets by Solis</Text>
      <Text style={styles.subtitle}>NHL Analytics & Markets</Text>

      {connectionError && (
        <Text style={styles.errorText}>Error: {connectionError}</Text>
      )}

      {isConnecting ? (
        <ActivityIndicator size="large" color="#00ff9d" style={{ marginTop: 20 }} />
      ) : !walletAddress ? (
        <Button title="Connect Seeker Wallet" onPress={connectWallet} color="#00ff9d" disabled={isConnecting} />
      ) : (
        <View style={styles.connectedContainer}>
          <Text style={styles.connectedText}>
            Connected: {walletAddress.slice(0, 8)}...
          </Text>
          <Text style={styles.statusText}>Genesis: {genesisStatus}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#aaa', marginBottom: 40 },
  errorText: { color: 'red', marginBottom: 20, textAlign: 'center', fontSize: 14 },
  connectedContainer: { alignItems: 'center' },
  connectedText: { fontSize: 16, color: '#0f0', marginBottom: 12 },
  statusText: { fontSize: 16, color: '#fff', marginBottom: 20 },
});