import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  try {
    const total = await prisma.transaction.count();
    const transactions = await prisma.transaction.findMany({
      orderBy: { blockNumber: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return Response.json({
      transactions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
        totalTransactions: total,
      },
    });
  } catch (err) {
    return console.error('Error fetching transactions:', err);
    // Fallback to blockchain if DB fails
    try {
      const { getLatestBlockNumber, getBlocksInRange } = await import('../../../lib/blockchain');
      const latestBlockNumber = await getLatestBlockNumber();
      let transactions = [];
      let currentBlock = latestBlockNumber;
      const startIndex = (page - 1) * pageSize;
      while (transactions.length < startIndex + pageSize && currentBlock >= 0) {
        const batchSize = 5;
        const endBlock = currentBlock;
        const startBlock = Math.max(0, endBlock - batchSize + 1);
        const blocks = await getBlocksInRange(startBlock, endBlock);
        for (const block of blocks) {
          if (block.transactions) {
            const txsWithTimestamp = block.transactions.map(tx => ({
              hash: tx.hash,
              blockNumber: tx.blockNumber,
              from: tx.from,
              to: tx.to,
              value: tx.value.toString(),
              gasPrice: tx.gasPrice?.toString(),
              gas: tx.gas?.toString(),
              nonce: tx.nonce,
              input: tx.input,
              timestamp: block.timestamp,
              status: tx.status ?? true
            }));
            transactions = [...transactions, ...txsWithTimestamp];
          }
        }
        currentBlock = startBlock - 1;
      }
      transactions.sort((a, b) => b.blockNumber - a.blockNumber);
      const paginatedTransactions = transactions.slice(startIndex, startIndex + pageSize);
      const avgTxPerBlock = transactions.length / Math.min(10, latestBlockNumber + 1);
      const estimatedTotalTxs = Math.floor(avgTxPerBlock * (latestBlockNumber + 1));
      return Response.json({
        transactions: paginatedTransactions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(estimatedTotalTxs / pageSize),
          totalTransactions: estimatedTotalTxs,
        },
      });
    } catch (fallbackErr) {
      return Response.json({ error: 'Database and blockchain fallback failed.' }, { status: 500 });
    }
  }
}
