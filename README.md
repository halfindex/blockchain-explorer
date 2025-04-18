# RDT Chain Blockchain Explorer

A modern, open-source, ultra simple blockchain explorer built for EVM-compatible blockchains. This project provides a beautiful, responsive, and feature-rich interface for exploring blocks, transactions, addresses, and network analytics—all powered by live on-chain data.

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

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Credits
- Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), and [Chart.js](https://www.chartjs.org/)
- Inspired by open-source blockchain explorers and the EVM ecosystem

---