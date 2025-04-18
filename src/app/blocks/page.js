import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlockCard from '../../components/BlockCard';
import Link from 'next/link';
import { getLatestBlockNumber, getBlocksInRange } from '../../lib/blockchain';
import { FiRefreshCw } from 'react-icons/fi';

async function getBlocks(page = 1, pageSize = 10) {
    try {
        // Get latest block number
        const latestBlockNumber = await getLatestBlockNumber();

        // Calculate start and end block numbers for pagination
        const endBlock = Math.max(0, latestBlockNumber - (page - 1) * pageSize);
        const startBlock = Math.max(0, endBlock - pageSize + 1);

        // Get blocks in the calculated range
        const blocks = await getBlocksInRange(startBlock, endBlock);

        // Create serializable block objects by removing circular references
        const serializedBlocks = blocks.map(block => ({
            number: block.number,
            hash: block.hash,
            parentHash: block.parentHash,
            timestamp: block.timestamp,
            transactions: block.transactions?.length || 0, // Just store the count for the list view
            gasUsed: block.gasUsed?.toString(),
            gasLimit: block.gasLimit?.toString(),
            miner: block.miner,
            nonce: block.nonce,
            difficulty: block.difficulty?.toString(),
            totalDifficulty: block.totalDifficulty?.toString(),
            size: block.size?.toString(),
            extraData: block.extraData,
            baseFeePerGas: block.baseFeePerGas?.toString()
        }));

        return {
            blocks: serializedBlocks.reverse(),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil((latestBlockNumber + 1) / pageSize),
                totalBlocks: latestBlockNumber + 1,
            }
        };
    } catch (error) {
        console.error('Error fetching blocks:', error);
        return {
            blocks: [],
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalBlocks: 0,
            }
        };
    }
}

export default async function BlocksPage({ searchParams }) {
    const awaitedSearchParams = await searchParams;
    const pageParam = awaitedSearchParams?.page ? Number(awaitedSearchParams.page) : 1;
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    const { blocks, pagination } = await getBlocks(page);

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8 animate-fade-in">
                <section className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl font-extrabold mb-2 text-primary drop-shadow">Blocks</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Displaying blocks {pagination.totalBlocks - (page - 1) * 10 - blocks.length + 1} to {pagination.totalBlocks - (page - 1) * 10} out of {pagination.totalBlocks.toLocaleString()} total blocks
                            </p>
                        </div>
                        <Link
                            href="/blocks"
                            className="btn btn-primary btn-sm self-start flex items-center gap-2 shadow-md"
                        >
                            <FiRefreshCw size={16} />
                            Refresh
                        </Link>
                    </div>

                    {blocks.length === 0 ? (
                        <div className="bg-base-200 rounded-xl p-8 text-center">
                            <p className="text-lg mb-2">No blocks found</p>
                            <p className="text-gray-500">There are no blocks available for this page.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 mb-8">
                            {blocks.map((block) => (
                                <BlockCard key={block.hash} block={block} />
                            ))}
                        </div>
                    )}
                </section>

                <div className="flex justify-center gap-3 pb-8">
                    {page > 1 && (
                        <Link
                            href={`/blocks?page=${page - 1}`}
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
                            href={`/blocks?page=${page + 1}`}
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