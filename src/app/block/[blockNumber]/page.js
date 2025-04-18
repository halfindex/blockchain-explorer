import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BlockCard from '../../../components/BlockCard';
import TransactionCard from '../../../components/TransactionCard';
import Link from 'next/link';
import { getBlockDetails } from '../../../lib/blockchain';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const awaitedParams = await params;
    try {
        const blockNumber = parseInt(awaitedParams.blockNumber, 10);
        return {
            title: `Block #${blockNumber} | RDT Chain Explorer`,
            description: `Details for Block #${blockNumber} on RDT Chain Explorer`,
        };
    } catch (error) {
        return {
            title: 'Block Not Found | RDT Chain Explorer',
            description: 'The requested block could not be found on RDT Chain Explorer',
        };
    }
}

async function getBlockData(blockNumber) {
    try {
        const blockNumberInt = parseInt(blockNumber, 10);

        if (isNaN(blockNumberInt)) {
            return null;
        }

        const blockData = await getBlockDetails(blockNumberInt);
        if (!blockData) {
            return null;
        }

        // Serialize transactions to avoid circular references
        const serializedTransactions = blockData.transactions
            ? await Promise.all(
                blockData.transactions.map(async (tx) => {
                    if (typeof tx === 'string') {
                        // Only hash, fetch full details
                        try {
                            const { getTransactionDetails } = await import('../../../lib/blockchain');
                            const fullTx = await getTransactionDetails(tx);
                            return {
                                hash: fullTx.hash,
                                blockNumber: fullTx.blockNumber,
                                from: fullTx.from,
                                to: fullTx.to,
                                value: fullTx.value?.toString(),
                                gasPrice: fullTx.gasPrice?.toString(),
                                gas: fullTx.gas?.toString(),
                                nonce: fullTx.nonce,
                                input: fullTx.input,
                                status: fullTx.status ?? true,
                                timestamp: blockData.timestamp,
                            };
                        } catch {
                            return { hash: tx, timestamp: blockData.timestamp };
                        }
                    } else if (tx && typeof tx === 'object') {
                        // Already a full object
                        return {
                            hash: tx.hash,
                            blockNumber: tx.blockNumber,
                            from: tx.from,
                            to: tx.to,
                            value: tx.value?.toString(),
                            gasPrice: tx.gasPrice?.toString(),
                            gas: tx.gas?.toString(),
                            nonce: tx.nonce,
                            input: tx.input,
                            status: tx.status ?? true,
                            timestamp: blockData.timestamp,
                        };
                    } else {
                        return null;
                    }
                })
            )
            : [];


        // Create a serialized block object
        return {
            number: blockData.number,
            hash: blockData.hash,
            parentHash: blockData.parentHash,
            timestamp: blockData.timestamp,
            transactions: serializedTransactions,
            gasUsed: blockData.gasUsed?.toString(),
            gasLimit: blockData.gasLimit?.toString(),
            miner: blockData.miner,
            nonce: blockData.nonce,
            difficulty: blockData.difficulty?.toString(),
            totalDifficulty: blockData.totalDifficulty?.toString(),
            size: blockData.size?.toString(),
            extraData: blockData.extraData,
            baseFeePerGas: blockData.baseFeePerGas?.toString()
        };
    } catch (error) {
        console.error('Error fetching block data:', error);
        return null;
    }
}

export default async function BlockPage({ params }) {
    const awaitedParams = await params;
    const blockNumber = parseInt(awaitedParams.blockNumber, 10);
    const block = await getBlockData(blockNumber);

    if (!block) {
        notFound();
    }

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8 animate-fade-in">
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Link href="/blocks" className="text-primary hover:underline">
                            Blocks
                        </Link>
                        <span>›</span>
                        <span className="font-semibold">Block #{blockNumber}</span>
                    </div>

                    <h1 className="text-4xl font-extrabold mb-6 text-primary drop-shadow">Block #{blockNumber}</h1>

                    <BlockCard block={block} showFullDetails />
                </section>

                {block.transactions && block.transactions.length > 0 ? (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Transactions</h2>
                        <div className="space-y-4">
                            {block.transactions.map((tx) => (
                                <TransactionCard
                                    key={tx.hash}
                                    transaction={tx}
                                />
                            ))}
                        </div>
                    </section>
                ) : (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Transactions</h2>
                        <div className="bg-base-200 rounded-xl shadow-md p-6 text-center">
                            <p className="text-gray-600 dark:text-gray-400">No transactions in this block</p>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
} 