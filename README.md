# Open Source Blockchain Explorer

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Demo](https://img.shields.io/badge/demo-online-blue.svg)](https://explorer.rdtchain.com)
[![GitHub Stars](https://img.shields.io/github/stars/halfindex/blockchain-explorer?style=social)](https://github.com/halfindex/blockchain-explorer/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/halfindex/blockchain-explorer?style=social)](https://github.com/halfindex/blockchain-explorer/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/halfindex/blockchain-explorer)](https://github.com/halfindex/blockchain-explorer/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/halfindex/blockchain-explorer)](https://github.com/halfindex/blockchain-explorer/pulls)

> **Keywords:** open source blockchain explorer, EVM explorer, Ethereum explorer, block explorer, self-hosted, blockchain analytics, Polygon, BSC, Next.js, React, analytics

---

## 🚀 Summary Table

| Feature                | Description                                                      |
|------------------------|------------------------------------------------------------------|
| **Multi-chain Support**| Ethereum, Polygon, BSC, and any EVM-compatible network           |
| **Live Data**          | Fetches blocks/transactions directly from your RPC node           |
| **Analytics**          | Bar & line charts for tx volume, block activity, and more         |
| **Beautiful UI**       | Responsive, dark mode, Tailwind CSS, modern UX                   |
| **Self-hosted**        | No central server, deploy anywhere, private or public networks    |
| **Open Source**        | MIT License, free for commercial and personal use                |
| **Easy Setup**         | Plug in your RPC endpoint and start exploring                    |

---

## ⭐ Why Use This Explorer?

- **Truly Open Source**: MIT licensed, no vendor lock-in, free for any use
- **Self-Hosted & Private**: Deploy on your own infrastructure, for public or private chains
- **Plug-and-Play**: Works with any EVM-compatible RPC (Ethereum, Polygon, BSC, Avalanche, etc)
- **Modern UI/UX**: Clean, responsive, and dark-mode ready
- **Analytics Built-In**: Visualize blocks and transactions with beautiful charts
- **No Database Required**: Fetches data directly from your blockchain node
- **Easy Customization**: Change branding, colors, and charts in minutes

### 🔍 Comparison to Other Blockchain Explorers

| Feature              | This Explorer | Blockscout | Etherscan (closed) | Otterscan |
|----------------------|:-------------:|:----------:|:------------------:|:---------:|
| **Open Source**      | ✅           | ✅         | ❌                 | ✅        |
| **Self-Hosted**      | ✅           | ✅         | ❌                 | ✅        |
| **No DB Needed**     | ✅           | ❌         | ❌                 | ❌        |
| **EVM Support**      | ✅           | ✅         | ✅                 | ✅        |
| **Modern UI**        | ✅           | ➖         | ✅                 | ✅        |
| **Customizable**     | ✅           | ➖         | ❌                 | ➖        |
| **MIT License**      | ✅           | ➖         | ❌                 | ➖        |

---

## 🙋 Frequently Asked Questions (FAQ)

**Q: Can I use this explorer for my private or testnet chain?**  
A: Yes! Just point the RPC URL to your node and set the chain ID in `.env`.

**Q: Does it require a database?**  
A: No, all data is fetched live from your blockchain node.

**Q: Can I add more charts or analytics?**  
A: Yes, the code is modular and easy to extend.

**Q: How do I contribute?**  
A: Fork the repo, make your changes, and open a pull request!

---

> ⭐ **If you find this project useful, please [star](https://github.com/halfindex/blockchain-explorer) and [fork](https://github.com/halfindex/blockchain-explorer/fork) it on GitHub to help others discover it!**

---

## Demo
[https://explorer.rdtchain.com](https://explorer.rdtchain.com)

---

## Features

- **Live Blockchain Data:**
  - Fetches and displays blocks, transactions, and address data directly from the connected EVM-compatible node (no database required).
- **Rich Visual Analytics:**
  - Bar chart: Transactions per block (last 10 blocks)
  - Line chart: Transaction value trend (last 100 txs)
- **Detailed Block & Transaction Views:**
  - Copy-to-clipboard for hashes, addresses, and more
  - Responsive tables with sorting and overflow handling
- **Address Lookup:**
  - View balances, transaction counts, and contract status for any address
- **Modern UI/UX:**
  - Responsive design, dark mode, and attractive components

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/halfindex/blockchain-explorer.git
cd rdtchain-explorer
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and update as needed:
```bash
cp .env.example .env
```

**.env.example:**
```
NEXT_PUBLIC_APP_NAME="Ethereum"
NEXT_PUBLIC_RPC_URL="http://eth-mainnet-rpc.com"
NEXT_PUBLIC_CHAIN_ID="1"
NEXT_PUBLIC_COIN="ETH"
NEXT_PUBLIC_DECIMALS=18
NODE_ENV="production"
```
- `NEXT_PUBLIC_RPC_URL`: Your EVM-compatible node's RPC endpoint
- `NEXT_PUBLIC_CHAIN_ID`: Chain ID (e.g. 1 for Ethereum mainnet)
- `NEXT_PUBLIC_COIN`: Coin symbol (e.g. ETH, RDT)
- `NEXT_PUBLIC_DECIMALS`: Native token decimals (usually 18)

### 4. Run the Explorer
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

- `src/app/` — Next.js app routes and pages
- `src/components/` — React UI components (charts, cards, tables)
- `src/lib/` — Blockchain RPC helpers and utilities

---

## Customization
- **Branding:** Change `NEXT_PUBLIC_APP_NAME` and logo assets as desired
- **Network:** Point to any EVM-compatible chain by changing the `.env` settings
- **Charts:** Edit or extend chart components for custom analytics

---

## Contributing
Pull requests, issues, and feature suggestions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b my-feature`)
3. Commit your changes
4. Open a pull request

---

## Production Deployment with PM2

To run the explorer in production using [PM2](https://pm2.keymetrics.io/):

```bash
pm2 start ecosystem.config.cjs
```

This will start the app as defined in `ecosystem.config.cjs`.

**Other useful PM2 commands:**
- View logs: `pm2 logs explorer-app`
- Stop: `pm2 stop explorer-app`
- Restart: `pm2 restart explorer-app`
- Status: `pm2 status`

---

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Credits
- Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), and [Chart.js](https://www.chartjs.org/)
- Inspired by open-source blockchain explorers and the EVM ecosystem
- Designed and Developed by Half Index (www.halfindex.com)