// index.ts - Global polyfills + app registration

import { Buffer } from 'buffer';
global.Buffer = Buffer;  // Polyfill Buffer for Solana libs

import 'react-native-get-random-values';  // For crypto.getRandomValues (Solana dep)

import { registerRootComponent } from 'expo';
import App from './App';

// Register the root component
registerRootComponent(App);