import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import TransactionCard from '../../../components/TransactionCard';
import Link from 'next/link';
import { getTransactionDetails, getBlockDetails } from '../../../lib/blockchain';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const awaitedParams = await params;
    try {
        const txHash = awaitedParams.txHash;
        return {
            title: `Transaction ${txHash.substring(0, 10)}... | RDT Chain Explorer`,
            description: `Transaction details for ${txHash} on RDT Chain Explorer`,
        };
    } catch (error) {
        return {
            title: 'Transaction Not Found | RDT Chain Explorer',
            description: 'The requested transaction could not be found on RDT Chain Explorer',
        };
    }
}

async function getTransactionData(txHash) {
    try {
        const txData = await getTransactionDetails(txHash);
        if (!txData) {
            return null;
        }

        // Get the block to get the timestamp
        const blockData = await getBlockDetails(txData.blockNumber);

        return {
            ...txData,
            timestamp: blockData?.timestamp || Date.now(),
        };
    } catch (error) {
        console.error('Error fetching transaction data:', error);
        return null;
    }
}

export default async function TransactionPage({ params }) {
    const awaitedParams = await params;
    const txHash = awaitedParams.txHash;
    let transaction = await getTransactionData(txHash);

    if (!transaction) {
        notFound();
    }

    // Sanitize transaction for client component
    if (transaction) {
        const { provider, signature, ...plainTx } = transaction;
        Object.keys(plainTx).forEach(key => {
            if (typeof plainTx[key] === 'object' && plainTx[key] !== null && typeof plainTx[key].toJSON === 'function') {
                plainTx[key] = plainTx[key].toString();
            }
        });
        transaction = plainTx;
    }

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Link href="/txs" className="text-primary hover:underline">
                            Transactions
                        </Link>
                        <span>›</span>
                        <span>Transaction Details</span>
                    </div>

                    <h1 className="text-3xl font-bold mb-6 text-primary">Transaction Details</h1>

                    <TransactionCard transaction={transaction} showFullDetails />
                </section>
            </main>
            <Footer />
        </>
    );
} 