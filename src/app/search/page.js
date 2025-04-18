import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlockDetails, getTransactionDetails } from '../../lib/blockchain';

export const metadata = {
  title: 'Search | RDT Chain Explorer',
};

export default async function SearchPage({ searchParams }) {
  const search = await searchParams;
  const query = search?.q || '';
  let block = null;
  let transaction = null;
  let notFoundType = '';

  if (query) {
    // Try block number
    if (/^\d+$/.test(query)) {
      block = await getBlockDetails(Number(query));
      if (!block) notFoundType = 'block';
    } else if (/^0x[a-fA-F0-9]{64}$/.test(query)) {
      // Try transaction hash
      transaction = await getTransactionDetails(query);
      if (!transaction) notFoundType = 'transaction';
    } else {
      notFoundType = 'unknown';
    }
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-16">
        {block && (
          <div className="bg-base-200 rounded-xl p-8 text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-primary">Block Found</h2>
            <p className="mb-4">Block #{block.number} found. <Link href={`/block/${block.number}`} className="link link-primary">View Block</Link></p>
          </div>
        )}
        {transaction && (
          <div className="bg-base-200 rounded-xl p-8 text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-primary">Transaction Found</h2>
            <p className="mb-4">Transaction {transaction.hash.slice(0, 12)}... found. <Link href={`/tx/${transaction.hash}`} className="link link-primary">View Transaction</Link></p>
          </div>
        )}
        {notFoundType && (
          <div className="bg-error/10 border border-error rounded-xl p-8 text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-error">
              {notFoundType === 'block' && 'Block Not Found'}
              {notFoundType === 'transaction' && 'Transaction Not Found'}
              {notFoundType === 'unknown' && 'No Results Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">No matching {notFoundType !== 'unknown' ? notFoundType : 'result'} found for <span className="font-mono bg-base-100 px-2 rounded">{query}</span>.</p>
            <Link href="/" className="btn btn-primary">Back to Home</Link>
          </div>
        )}
        {!query && (
          <div className="bg-base-200 rounded-xl p-8 text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-primary">Search</h2>
            <p>Enter a block number or transaction hash in the search bar above.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
