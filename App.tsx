import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Connection, PublicKey } from '@solana/web3.js';

// Whitelabel config - change these for your project
const APP_NAME = 'Your App Name';
const APP_URI = 'https://your-app.com';
const APP_ICON = '/icon.png';
const TOKEN_MINT = new PublicKey('GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te'); // Genesis or your token
const TOKEN_MEMBER_ACCOUNT = new PublicKey('7RWZohJ2gG1rzV49WgUAbtK3Ds7B5nzHNtFHTkDBpsKs'); // Optional member account
const RPC_ENDPOINT = 'https://solana-mainnet.g.alchemy.com/v2/YOUR_KEY'; // Replace with your RPC

const connection = new Connection(RPC_ENDPOINT, 'confirmed');

export default function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<string>('Not checked');
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

      await checkTokenHold(pubkey);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect wallet';
      setConnectionError(msg);
      Alert.alert('Error', msg);
    } finally {
      setIsConnecting(false);
    }
  };

  const checkTokenHold = async (pubkey: PublicKey) => {
    try {
      console.log('Checking token hold for:', pubkey.toBase58());

      const memberInfo = await connection.getAccountInfo(TOKEN_MEMBER_ACCOUNT);
      console.log('Member account info:', memberInfo);

      if (memberInfo === null) {
        setTokenStatus('Token member account not found');
        return;
      }

      const msg = 'Holds Token (group member account exists)';
      setTokenStatus(msg);
      Alert.alert('Token Check', msg);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Token check failed';
      console.log('Token check failed:', msg, err);
      setTokenStatus('Not held');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{APP_NAME}</Text>
      <Text style={styles.subtitle}>Solana Mobile Wallet Example</Text>

      {connectionError && (
        <Text style={styles.errorText}>Error: {connectionError}</Text>
      )}

      {isConnecting ? (
        <ActivityIndicator size="large" color="#00ff9d" style={{ marginTop: 20 }} />
      ) : !walletAddress ? (
        <Button title="Connect Wallet" onPress={connectWallet} color="#00ff9d" disabled={isConnecting} />
      ) : (
        <View style={styles.connectedContainer}>
          <Text style={styles.connectedText}>
            Connected: {walletAddress.slice(0, 8)}...
          </Text>
          <Text style={styles.statusText}>Token Status: {tokenStatus}</Text>
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