# Solana Seeker Wallet Expo Template

A clean, production-tested Expo + React Native template for connecting to Solana Mobile Wallets (Seed Vault on Seeker devices) using the Mobile Wallet Adapter protocol. It decodes base64-encoded pubkeys and verifies Token-2022 NFT/group member hold status.

Battle-tested on real Seeker hardware.

## Features

- Mobile Wallet Adapter integration (`transact` + `authorize`)
- Base64 → base58 pubkey decoding (Seed Vault format)
- Token-2022 group member NFT hold check (account existence = hold)
- Polyfills for `Buffer` & `crypto.getRandomValues` (fixes TurboModule crashes)
- Loading states, error handling, debug logging
- Type-safe TypeScript (Expo SDK 51+)
- Custom wallet selection buttons (Seed Vault working; others placeholder)
- Helius RPC key loaded from `app.json` extra (secure, no `.env` files)

## Demo

*(Add screen recording here later)*

## Quick Start

1. **Clone the repo**
    ```bash
    git clone https://github.com/deFiFello/solana-seeker-wallet-expo-template.git
    cd solana-seeker-wallet-expo-template
    ```

2. **Install dependencies**
    ```bash
    yarn install
    ```

3. **Polyfills**
    - Already configured in `index.js` — no extra work needed.

4. **Run development server**
    ```bash
    npx expo start --dev-client --clear --reset-cache
    ```
    - If the local network fails, use Tunnel mode:
      ```bash
      npx expo start --dev-client --tunnel --clear --reset-cache
      ```

5. **Build custom dev client** *(first time or after native changes)*
    ```bash
    npx expo run:android
    ```
    - Connect Seeker via USB.
    - Wait 5–20 minutes.

6. **Connect & test**
    - Open the custom dev client on Seeker.
    - Scan the QR code or tap **Connect**.
    - Approve the Seed Vault prompt.
    - Tap **Connect Seeker Wallet** → status updates to hold message.

## Customization

Edit constants in `App.tsx`:
```tsx
const APP_NAME = 'Your App Name';
const APP_URI = 'https://your-app.com';
const APP_ICON = '/icon.png';

const TOKEN_MEMBER_ACCOUNT = new PublicKey('YOUR_MEMBER_ADDRESS');
```

Key is loaded from `app.json` extra (no `.env` files):
```json
"extra": {
  "heliusApiKey": "YOUR_HELIUS_KEY"
}
```

- Remove `checkGenesis` call if no NFT check is needed.
- Change cluster to `'devnet'` for testing.

## Requirements

- **Expo SDK 51+**
- **React Native 0.74+**
- **Android device with Seed Vault** (Seeker recommended)

### Dependencies:
- `@solana-mobile/mobile-wallet-adapter-protocol-web3js`
- `@solana/web3.js`
- `react-native-get-random-values`
- `expo-constants`

## Troubleshooting

- **RNGetRandomValues crash** → Run:
  ```bash
  npx expo run:android
  ```
- **Connection fails** → Use `--tunnel` or check Wi-Fi/firewall.
- **Token not detected** → Verify member account on Solscan/explorer.
- **401 invalid key** → Create a new Helius key and update `app.json` extra.

## License

MIT License  
Copyright (c) 2025 Chris Hull / @SolisTerminal  

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Questions or Issues?

Built by **@SolisTerminal**  
Open an issue or DM on X.

**Current status:**  
- Seed Vault connection + Genesis hold check working *(February 2025)*.  
- Multi-wallet (Phantom, Solflare, Jupiter Mobile, Backpack) in progress with custom buttons.