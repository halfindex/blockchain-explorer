"use client";

import { formatEth, formatNumber } from '../lib/utils';
const coinSymbol = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_COIN ? process.env.NEXT_PUBLIC_COIN : 'RDT';
const coinDecimals = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DECIMALS ? Number(process.env.NEXT_PUBLIC_DECIMALS) : 18;
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

export default function AddressCard({ address }) {
    const [copied, setCopied] = useState(false);

    if (!address) return null;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(address.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl border border-primary/10 hover:border-primary/30 transition-all duration-200 hover:-translate-y-1 backdrop-blur-md animate-fade-in p-6">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold text-primary drop-shadow">
                        {address.isContract ? 'Contract' : 'Address'}
                    </h2>
                    <div className="inline-flex items-center gap-2">
                        <button
                            onClick={copyToClipboard}
                            className="btn btn-sm btn-circle"
                            aria-label="Copy address"
                        >
                            {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                        </button>
                    </div>
                </div>

                <div className="bg-base-200 p-3 rounded-lg break-all font-mono text-sm">
                    {address.address}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="card-stats">
                        <div className="stat" style={{
                            overflow: 'auto'
                        }}>
                            <div className="stat-title">Balance</div>
                            <div className="stat-value text-primary">{address.balance}</div>
                        </div>
                    </div>

                    <div className="card-stats">
                        <div className="stat">
                            <div className="stat-title">Transactions</div>
                            <div className="stat-value">{formatNumber(address.txCount)}</div>
                        </div>
                    </div>
                </div>

                {/* Extra info: contract creation, first/last tx */}
                <div className="mt-6">
                    <table className="table w-full text-sm">
                        <tbody>
                            {address.creationTx && (
                                <tr>
                                    <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Contract Creation Tx</td>
                                    <td className="py-2 break-all font-mono">
                                        <a href={`/tx/${address.creationTx.hash}`} className="text-primary hover:underline">{address.creationTx.hash}</a>
                                        <span className="ml-2 text-xs text-gray-400">(Block {address.creationTx.blockNumber}, {address.creationTx.timestamp ? new Date(address.creationTx.timestamp * 1000).toLocaleString() : ''})</span>
                                    </td>
                                </tr>
                            )}
                            {address.firstTx && (
                                <tr>
                                    <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">First Seen Tx</td>
                                    <td className="py-2 break-all font-mono">
                                        <a href={`/tx/${address.firstTx.hash}`} className="text-primary hover:underline">{address.firstTx.hash}</a>
                                        <span className="ml-2 text-xs text-gray-400">(Block {address.firstTx.blockNumber}, {address.firstTx.timestamp ? new Date(address.firstTx.timestamp * 1000).toLocaleString() : ''})</span>
                                    </td>
                                </tr>
                            )}
                            {address.lastTx && (
                                <tr>
                                    <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Last Seen Tx</td>
                                    <td className="py-2 break-all font-mono">
                                        <a href={`/tx/${address.lastTx.hash}`} className="text-primary hover:underline">{address.lastTx.hash}</a>
                                        <span className="ml-2 text-xs text-gray-400">(Block {address.lastTx.blockNumber}, {address.lastTx.timestamp ? new Date(address.lastTx.timestamp * 1000).toLocaleString() : ''})</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {address.isContract && address.bytecode && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Contract Bytecode</h3>
                        <div className="bg-base-200 p-3 rounded-lg overflow-x-auto">
                            <pre className="text-xs font-mono">{address.bytecode}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 