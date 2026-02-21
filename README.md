# Solana Seeker Wallet Expo Template

A clean, production-tested **Expo + React Native** template for connecting to **Solana Mobile Wallets** (Seed Vault on Seeker devices) using the Mobile Wallet Adapter protocol. It handles base64-encoded pubkey decoding from authorization and verifies **Token-2022 NFT/group member hold status**.

Battle-tested for real-world Seeker integration.

---

## Features

- Full Mobile Wallet Adapter integration (`transact` + `authorize`)
- Automatic base64 → base58 pubkey decoding (Seed Vault format)
- Token-2022 group member NFT hold detection (existence + ownership)
- Polyfills for `Buffer` & `crypto.getRandomValues` (fixes TurboModule crashes)
- Loading states, error handling, and debug logging
- Clean, type-safe TypeScript (Expo SDK 51+ compatible)

---

## Demo

*(Add a short screen recording here later — optional)*

---

## Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/solana-seeker-wallet-expo-template.git
cd solana-seeker-wallet-expo-template
```

### 2. Install dependencies
```bash
yarn install
# or
npm install
```

### 3. Polyfills
Already configured in `index.js` (`Buffer` + random values) — no extra work needed.

### 4. Run development server
```bash
npx expo start --dev-client --clear --reset-cache
```

If the local network fails, use Tunnel mode:
```bash
npx expo start --dev-client --tunnel --clear --reset-cache
```

### 5. Build custom dev client
*(First time or after native changes)*:
```bash
npx expo run:android
```

- Connect your Android device (Seeker) via USB.
- Wait for build/install (5–20 min depending on cache).

### 6. Connect & test
- Open the custom dev client app on your Seeker.
- Scan the QR code or tap **Connect** (auto-detects server).
- Approve the Seed Vault prompt.
- App loads → tap **Connect Wallet** to test.

---

## Customization

Edit these constants in `App.tsx`:
```tsx
const APP_NAME = 'Your App Name';
const APP_URI = 'https://your-app.com';
const APP_ICON = '/icon.png';

const TOKEN_MEMBER_ACCOUNT = new PublicKey('YOUR_MEMBER_ACCOUNT_ADDRESS'); // optional
const RPC_ENDPOINT = 'https://mainnet.helius-rpc.com/?api-key=YOUR_KEY'; // Helius, Alchemy, etc.
```

- Remove `checkTokenHold` call if you don't need NFT check.
- Change `cluster: 'mainnet-beta'` to `'devnet'` for testing.

---

## Requirements

- **Expo SDK 51+**
- **React Native 0.74+**
- **Android device with Seed Vault** (Seeker recommended)

### Dependencies:
- `@solana-mobile/mobile-wallet-adapter-protocol-web3js`
- `@solana/web3.js`
- `react-native-get-random-values`

---

## Troubleshooting

- **RNGetRandomValues crash** → Run `npx expo run:android` to rebuild the custom client.
- **Connection fails** → Use `--tunnel` mode or check Wi-Fi/firewall.
- **Token not detected** → Verify the member account on Solscan/explorer.

---

## License

MIT License  
Copyright (c) 2025 [Your Name / @SolisTerminal]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Questions or Issues?

Built by **@SolisTerminal**  
Questions or issues? Open an issue or DM on X.

---