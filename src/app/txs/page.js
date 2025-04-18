"use client";

import { Suspense } from 'react';
import { useEffect, useState } from "react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TransactionTable from '../../components/TransactionTable';
import Spinner from '../../components/Spinner';
import Link from 'next/link';
import { FiRefreshCw } from 'react-icons/fi';
import { useSearchParams } from "next/navigation";

async function fetchTransactions(page = 1, pageSize = 10) {
  // Fetch 5 blocks per page, latest first
  const { getLatestBlockNumber, getBlocksInRange } = await import('../../lib/blockchain');
  const blocksPerPage = 5;
  const latestBlockNumber = await getLatestBlockNumber();
  const totalPages = Math.ceil((latestBlockNumber + 1) / blocksPerPage);
  const startBlock = latestBlockNumber - ((page - 1) * blocksPerPage);
  const endBlock = Math.max(0, startBlock - blocksPerPage + 1);
  const blocks = await getBlocksInRange(endBlock, startBlock);
  let transactions = [];
  for (const block of blocks.reverse()) { // oldest to newest in this page
    if (block && block.transactions && Array.isArray(block.transactions)) {
      const txsWithTimestamp = await Promise.all(block.transactions.map(async tx => {
        if (typeof tx === 'string') {
          // tx is a hash, fetch details
          try {
            const { getTransactionDetails } = await import('../../lib/blockchain');
            const fullTx = await getTransactionDetails(tx);
            return {
              hash: fullTx.hash,
              blockNumber: fullTx.blockNumber,
              from: fullTx.from,
              to: fullTx.to,
              value: fullTx.value?.toString?.() ?? fullTx.value ?? '0',
              gasPrice: fullTx.gasPrice?.toString?.() ?? fullTx.gasPrice ?? '',
              gas: fullTx.gas?.toString?.() ?? fullTx.gas ?? '',
              nonce: fullTx.nonce,
              input: fullTx.input,
              timestamp: block.timestamp,
              status: fullTx.status ?? true
            };
          } catch {
            return { hash: tx, timestamp: block.timestamp };
          }
        } else if (tx && typeof tx === 'object') {
          // tx is full object
          return {
            hash: tx.hash,
            blockNumber: tx.blockNumber,
            from: tx.from,
            to: tx.to,
            value: tx.value?.toString?.() ?? tx.value ?? '0',
            gasPrice: tx.gasPrice?.toString?.() ?? tx.gasPrice ?? '',
            gas: tx.gas?.toString?.() ?? tx.gas ?? '',
            nonce: tx.nonce,
            input: tx.input,
            timestamp: block.timestamp,
            status: tx.status ?? true
          };
        } else {
          return null;
        }
      }));
      transactions = [...transactions, ...txsWithTimestamp.filter(Boolean)];
    }
  }
  return {
    transactions,
    pagination: {
      currentPage: page,
      totalPages,
      totalBlocks: latestBlockNumber + 1,
      blocksPerPage,
    },
  };
}

function TransactionsPageInner() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const page = isNaN(Number(pageParam)) || Number(pageParam) < 1 ? 1 : Number(pageParam);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTransactions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTransactions(page).then(({ transactions, pagination }) => {
      setTransactions(transactions);
      setPagination(pagination);
      setLoading(false);
    });
  }, [page]);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-primary">Transactions</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Showing transactions from blocks {Math.max(1, pagination.totalBlocks - (page - 1) * pagination.blocksPerPage)}
                to {Math.max(1, pagination.totalBlocks - (page - 1) * pagination.blocksPerPage - pagination.blocksPerPage + 1)}
                (Page {page} of {pagination.totalPages}, {pagination.blocksPerPage} blocks per page)
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm self-start flex items-center gap-2"
              onClick={() => window.location.reload()}
            >
              <FiRefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <Spinner />
          ) : transactions.length === 0 ? (
            <div className="bg-base-200 rounded-xl p-8 text-center">
              <p className="text-lg mb-2">No transactions found</p>
              <p className="text-gray-500">There are no transactions available for this page.</p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              <TransactionTable transactions={transactions} />
            </div>
          )}

        </section>

        <div className="flex justify-center gap-3 pb-8">
          {page > 1 && (
            <Link
              href={`/txs?page=${page - 1}`}
              className="btn btn-outline btn-primary"
            >
              Previous
            </Link>
          )}

          <span className="px-5 py-2 rounded-lg bg-base-200 flex items-center font-medium">
            Page {page} of {pagination.totalPages}
          </span>

          {page < pagination.totalPages && (
            <Link
              href={`/txs?page=${page + 1}`}
              className="btn btn-outline btn-primary"
            >
              Next
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionsPageInner />
    </Suspense>
  );
}