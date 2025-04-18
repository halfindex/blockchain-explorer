import Header from '../components/Header';
import Footer from '../components/Footer';
import BlockCard from '../components/BlockCard';
import TransactionCard from '../components/TransactionCard';
import BlockTxVolumeChart from '../components/BlockTxVolumeChart';
import TxValueLineChart from '../components/TxValueLineChart';
import Link from 'next/link';
import { getLatestBlockNumber, getBlockDetails, getTransactionDetails } from '../lib/blockchain';

async function getHomePageData() {
  try {
    const latestBlockNumber = await getLatestBlockNumber();

    // Fetch latest 10 blocks
    const blockNumbers = [];
    for (let i = latestBlockNumber; i > latestBlockNumber - 10 && i >= 0; i--) {
      blockNumbers.push(i);
    }
    const latestBlocks = await Promise.all(blockNumbers.map(n => getBlockDetails(n)));

    // Gather all transactions from these blocks (with block timestamp)
    let allTxs = [];
    for (const block of latestBlocks) {
      if (block?.transactions) {
        console.log('block txns', block.transactions);
        allTxs.push(...block.transactions.map(hash => ({
          hash,
          timestamp: block.timestamp
        })));
      }
    }

    // Sort by timestamp descending and take latest 5
    allTxs.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
    const txsToFetch = allTxs.filter(tx => !!tx.hash).slice(0, 5);

    // Fetch full transaction details for each hash
    const detailedTxs = await Promise.all(
      txsToFetch.map(async tx => {
        try {
          const fullTx = await getTransactionDetails(tx.hash);
          return { ...fullTx, timestamp: tx.timestamp };
        } catch {
          return { hash: tx.hash, timestamp: tx.timestamp };
        }
      })
    );
    const latestTransactions = detailedTxs;


    // Stats
    let avgBlockTime = 5;
    if (latestBlocks.length > 1) {
      const ts = latestBlocks.map(b => Math.floor(Number(b.timestamp) / 1000));
      const diffs = [];
      for (let i = 0; i < ts.length - 1; i++) {
        const d = ts[i] - ts[i + 1];
        if (d > 0) diffs.push(d);
      }
      if (diffs.length) avgBlockTime = Math.round(Math.floor(diffs.reduce((a, b) => a + b, 0) / diffs.length) / 100000);
    }
    const totalTxs = latestBlocks.reduce((a, b) => a + (b.transactions?.length || 0), 0);
    let gasPrice = 0;
    if (latestTransactions.length) {
      const gp = latestTransactions.map(tx => Number(tx.gasPrice || 0)).filter(p => p > 0);
      if (gp.length) gasPrice = Math.floor(gp.reduce((a, b) => a + b, 0) / gp.length / 1e9);
    }

    // Serialize blocks and txs
    const serializedBlocks = latestBlocks.map(block => ({
      number: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: block.timestamp,
      transactions: block.transactions?.map(tx => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value?.toString(),
        gasPrice: tx.gasPrice?.toString(),
        gas: tx.gas?.toString(),
      })) || [],
      gasUsed: block.gasUsed?.toString(),
      gasLimit: block.gasLimit?.toString(),
      miner: block.miner,
      nonce: block.nonce,
      difficulty: block.difficulty?.toString(),
      totalDifficulty: block.totalDifficulty?.toString(),
      size: block.size?.toString(),
      extraData: block.extraData,
      baseFeePerGas: block.baseFeePerGas?.toString(),
    }));
    const serializedTxs = latestTransactions.map(tx => ({
      hash: tx.hash,
      blockNumber: tx.blockNumber,
      from: tx.from,
      to: tx.to,
      value: tx.value?.toString(),
      gasPrice: tx.gasPrice?.toString(),
      gas: tx.gas?.toString(),
      nonce: tx.nonce,
      input: tx.input,
      timestamp: tx.timestamp,
    }));

    return {
      latestBlocks: serializedBlocks,
      latestTransactions: serializedTxs,
      stats: { latestBlock: latestBlockNumber, avgBlockTime, totalTxs, gasPrice },
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      latestBlocks: [],
      latestTransactions: [],
      stats: { latestBlock: 0, avgBlockTime: 5, totalTxs: 0, gasPrice: 0 },
    };
  }
}

export default async function Home() {
  const { latestBlocks, latestTransactions, stats } = await getHomePageData();

  return (
    <>
      <Header />
      <main className="relative w-full min-h-screen flex flex-col items-center overflow-x-hidden">
        {/* HERO SECTION */}
        <section className="w-full flex flex-col items-center justify-center pt-24 pb-16 relative overflow-visible">
          {/* Animated Gradient Accent */}
          <div className="absolute top-0 left-1/2 w-[480px] h-[160px] blur-3xl opacity-40 bg-gradient-to-r from-primary via-accent to-secondary rounded-full animate-dot-float pointer-events-none select-none" />
          <h1 className="text-5xl md:text-6xl font-black mb-4  tracking-tight animate-fade-in-up text-center">
            Explore RDT Chain
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 opacity-90 max-w-2xl mx-auto font-medium mb-8 animate-fade-in-up text-center">
            The next-gen blockchain explorer — fast, secure and free.
          </p>
        </section>

        {/* STATS HIGHLIGHTS */}
        <section className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 -mt-12 z-10 animate-fade-in-up px-4">
          {/* Animated stat cards */}
          <div className="rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-primary/10 backdrop-blur-md flex flex-col items-center p-6 transition hover:scale-105 hover:shadow-2xl">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-extrabold text-primary drop-shadow mb-1">{stats.latestBlock}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Latest Block</div>
          </div>
          <div className="rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-primary/10 backdrop-blur-md flex flex-col items-center p-6 transition hover:scale-105 hover:shadow-2xl">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-extrabold text-primary drop-shadow mb-1">{stats.avgBlockTime}s</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Avg Block Time</div>
          </div>
          <div className="rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-primary/10 backdrop-blur-md flex flex-col items-center p-6 transition hover:scale-105 hover:shadow-2xl">
            <div className="text-3xl mb-2">🔗</div>
            <div className="text-2xl font-extrabold text-primary drop-shadow mb-1">{stats.totalTxs}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total Txs</div>
          </div>
          <div className="rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-primary/10 backdrop-blur-md flex flex-col items-center p-6 transition hover:scale-105 hover:shadow-2xl">
            <div className="text-3xl mb-2">⛽</div>
            <div className="text-2xl font-extrabold text-primary drop-shadow mb-1">{stats.gasPrice} Gwei</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">Avg Gas Price</div>
          </div>
        </section>

        {/* Charts Row - Centered */}
        <div className="flex flex-col md:flex-row w-full justify-center gap-8 items-center">
          <div className="flex-1 flex justify-center min-w-[320px] max-w-xl">
            <BlockTxVolumeChart blocks={latestBlocks} />
          </div>
          <div className="flex-1 flex justify-center min-w-[320px] max-w-xl">
            <TxValueLineChart transactions={latestTransactions.slice(0, 100)} />
          </div>
        </div>

        {/* Latest Blocks & Transactions */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 mt-20 px-4">
          {/* Latest Blocks */}
          <section className="bg-white/70 dark:bg-gray-900/70 mb-10 p-6 rounded-2xl shadow-lg border border-primary/10 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary drop-shadow section-title underline decoration-accent/60 decoration-4 underline-offset-8">Latest Blocks</h2>
              <Link href="/blocks" className="text-accent font-semibold hover:underline text-sm transition-colors">View All</Link>
            </div>
            <div className="flex flex-col gap-4">
              {latestBlocks.map((block) => (
                <BlockCard key={block.hash} block={block} />
              ))}
            </div>
          </section>

          {/* Latest Transactions */}
          <section className="bg-white/70 dark:bg-gray-900/70 mb-10 p-6 rounded-2xl shadow-lg border border-primary/10 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary drop-shadow section-title underline decoration-accent/60 decoration-4 underline-offset-8">Latest Transactions</h2>
              <Link href="/txs" className="text-accent font-semibold hover:underline text-sm transition-colors">View All</Link>
            </div>
            <div className="flex flex-col gap-4">
              {latestTransactions.map((tx, i) => (
                <TransactionCard key={tx.hash || tx.nonce || tx.timestamp || i} transaction={tx} />
              ))}
              {latestTransactions.length === 0 && (
                <div className="rounded-xl bg-white/60 dark:bg-gray-900/60 shadow border border-primary/10 text-center py-8">
                  <p className="text-gray-500">No transactions available</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
