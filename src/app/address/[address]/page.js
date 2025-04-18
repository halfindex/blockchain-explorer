import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import AddressCard from '../../../components/AddressCard';
import TransactionCard from '../../../components/TransactionCard';
import Link from 'next/link';
import { getAddressBalance, isContract, getTransactionCount } from '../../../lib/blockchain';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const awaitedParams = await params;
    try {
        const address = awaitedParams.address;
        return {
            title: `Address ${address.substring(0, 10)}... | RDT Chain Explorer`,
            description: `Address details for ${address} on RDT Chain Explorer`,
        };
    } catch (error) {
        return {
            title: 'Address Not Found | RDT Chain Explorer',
            description: 'The requested address could not be found on RDT Chain Explorer',
        };
    }
}

async function getAddressData(addressHash) {
    try {
        // Get on-chain data
        const balance = await getAddressBalance(addressHash);
        const contract = await isContract(addressHash);
        const txCount = await getTransactionCount(addressHash);

        // Scan the latest 100 blocks for first/last tx and contract creation
        const { getLatestBlockNumber, getBlockDetails } = await import('../../../lib/blockchain');
        const latestBlockNumber = await getLatestBlockNumber();
        const scanBlocks = 100;
        let firstTx = null, lastTx = null, creationTx = null;
        for (let i = latestBlockNumber; i > latestBlockNumber - scanBlocks && i >= 0; i--) {
            const block = await getBlockDetails(i);
            if (block && block.transactions) {
                for (const tx of block.transactions) {
                    const txObj = typeof tx === 'string' ? { hash: tx } : tx;
                    if (txObj.from && txObj.from.toLowerCase() === addressHash.toLowerCase()) {
                        if (!lastTx) lastTx = { hash: txObj.hash, blockNumber: i, timestamp: block.timestamp };
                        firstTx = { hash: txObj.hash, blockNumber: i, timestamp: block.timestamp };
                        // Contract creation: contract address is null in tx.to
                        if (contract && !txObj.to) {
                            creationTx = { hash: txObj.hash, blockNumber: i, timestamp: block.timestamp };
                        }
                    }
                }
            }
        }
        return {
            address: addressHash,
            balance,
            isContract: contract,
            bytecode: contract ? '0x...' : null, // Placeholder
            txCount,
            firstTx,
            lastTx,
            creationTx
        };
    } catch (error) {
        console.error('Error fetching address data:', error);
        return null;
    }
}

// In a real application, this would fetch transactions for the address
import { getLatestBlockNumber, getBlockDetails, getTransactionDetails } from '../../../lib/blockchain';

async function getAddressTransactions(addressHash, page = 1, pageSize = 10) {
    // Scan latest 20 blocks for transactions
    const latestBlockNumber = await getLatestBlockNumber();
    const blockNumbers = [];
    for (let i = latestBlockNumber; i > latestBlockNumber - 20 && i >= 0; i--) {
        blockNumbers.push(i);
    }
    const blocks = await Promise.all(blockNumbers.map(n => getBlockDetails(n)));
    let txHashes = [];
    for (const block of blocks) {
        if (block?.transactions) {
            // block.transactions may be hashes or objects
            txHashes.push(...block.transactions.map(tx => typeof tx === 'string' ? tx : tx.hash));
        }
    }
    // Fetch all tx details
    const allTxs = (await Promise.all(
        txHashes.map(async (hash) => {
            try {
                const tx = await getTransactionDetails(hash);
                return tx;
            } catch {
                return null;
            }
        })
    )).filter(Boolean);
    // Filter for this address
    const filtered = allTxs.filter(tx => tx && (tx.from?.toLowerCase() === addressHash.toLowerCase() || tx.to?.toLowerCase() === addressHash.toLowerCase()));
    // Pagination
    const totalTransactions = filtered.length;
    const totalPages = Math.ceil(totalTransactions / pageSize);
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
    return {
        transactions: paged,
        pagination: {
            currentPage: page,
            totalPages,
            totalTransactions,
        }
    };
}

export default async function AddressPage({ params, searchParams }) {
    const awaitedParams = await params;
    const awaitedSearchParams = await searchParams;
    const addressHash = awaitedParams.address;
    const page = awaitedSearchParams?.page ? parseInt(awaitedSearchParams.page) : 1;

    const address = await getAddressData(addressHash);
    let { transactions, pagination } = await getAddressTransactions(addressHash, page);
    // Sanitize transactions for client components (remove non-plain objects)
    transactions = transactions.map(tx => {
        // Remove provider, signature, and any function properties
        const { provider, signature, ...plainTx } = tx;
        Object.keys(plainTx).forEach(key => {
            if (typeof plainTx[key] === 'object' && plainTx[key] !== null && typeof plainTx[key].toJSON === 'function') {
                plainTx[key] = plainTx[key].toString();
            }
        });
        return plainTx;
    });

    if (!address) {
        notFound();
    }

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Link href="/blocks" className="text-primary hover:underline">
                            Explore
                        </Link>
                        <span>›</span>
                        <span>Address</span>
                    </div>

                    <h1 className="text-3xl font-bold mb-6 text-primary">Address</h1>

                    <AddressCard address={address} />
                </section>

                {transactions.length > 0 && (
                    <section className="mb-8">
                        <h2 className="section-title">Transactions</h2>

                        <div className="space-y-4">
                            {transactions.map((tx) => (
                                <TransactionCard key={tx.hash} transaction={tx} />
                            ))}
                        </div>

                        <div className="flex justify-center gap-2 mt-4">
                            {page > 1 && (
                                <Link
                                    href={`/address/${addressHash}?page=${page - 1}`}
                                    className="pagination-btn"
                                >
                                    Previous
                                </Link>
                            )}

                            {pagination.totalPages > 0 && (
                                <span className="px-4 py-2 rounded-lg bg-base-200">
                                    Page {page} of {pagination.totalPages}
                                </span>
                            )}

                            {page < pagination.totalPages && (
                                <Link
                                    href={`/address/${addressHash}?page=${page + 1}`}
                                    className="pagination-btn"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
} 