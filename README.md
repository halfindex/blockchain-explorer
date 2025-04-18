# EVM Blockchain Explorer

A modern EVM-based blockchain explorer developed by [Half Index](https://halfindex.com).

## Features
- Syncs and indexes blocks and transactions from any EVM-compatible blockchain
- Fast transaction and block search
- Automatic background sync with deduplication
- Professional Next.js frontend
- Prisma + PostgreSQL for storage
- PM2 support for production and background jobs

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and set your:
- `DATABASE_URL` (PostgreSQL)
- `NEXT_PUBLIC_RPC_URL` (EVM node RPC)
- `NEXT_PUBLIC_CHAIN_ID` (Chain ID)
- `NEXT_PUBLIC_APP_NAME` (Explorer name)

### 3. Database setup
```bash
npx prisma migrate deploy
```

### 4. Development
Start the dev server:
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### 5. Production & Sync (PM2)
Build and start the app & background sync jobs:
```bash
npm run build
pm run start
# OR with PM2
pm2 start ecosystem.config.js
```

- `explorer-app`: Runs the Next.js frontend
- `explorer-cron`: Runs the blockchain sync every minute

## Credits
Developed by [Half Index](https://halfindex.com)

---
For support, contact hello@halfindex.com
