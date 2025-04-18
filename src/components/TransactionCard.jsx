"use client";

import Link from 'next/link';
import { formatTimeAgo, truncateString, formatEth } from '../lib/utils';
import { getTxUrl, getAddressUrl } from '../lib/utils';
import { FiClock, FiHash, FiCopy, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

export default function TransactionCard({ transaction, showFullDetails = false }) {
    const [copied, setCopied] = useState({});
    const handleCopy = async (key, value) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(prev => ({ ...prev, [key]: true }));
            setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 1800);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };
    const coinSymbol = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_COIN ? process.env.NEXT_PUBLIC_COIN : 'RDT';
    const coinDecimals = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DECIMALS ? Number(process.env.NEXT_PUBLIC_DECIMALS) : 18;
    if (!transaction) return null;


    if (!showFullDetails) {
        // Summary card (existing)
        return (
            <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl hover:shadow-2xl border border-primary/10 hover:border-primary/30 transition-all duration-200 hover:-translate-y-1 backdrop-blur-md animate-fade-in">
                <div className="p-5">
                    {/* Hash at the top */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-semibold text-primary text-base flex items-center gap-1">
                            <FiHash className="mr-1.5 text-accent" />
                            {transaction?.hash ? (
                                <>
                                    <Link href={getTxUrl(transaction.hash)} className="hover:underline">
                                        {truncateString(transaction.hash, 10, 8)}
                                    </Link>
                                    <button
                                        onClick={() => handleCopy('hash', transaction.hash)}
                                        className="ml-1 btn btn-xs btn-circle"
                                        aria-label="Copy hash"
                                        tabIndex={0}
                                    >
                                        {copied.hash ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                    </button>
                                </>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </span>
                        <span className="text-xs text-gray-400 ml-2 flex items-center">
                            <FiClock className="mr-1" />
                            {formatTimeAgo(transaction.timestamp)}
                        </span>
                    </div>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 py-2">
                        <div className="flex flex-col items-center sm:items-start w-full sm:w-1/3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">From</span>
                            {transaction?.from ? (
                                <span className="flex items-center gap-1">
                                    <Link href={getAddressUrl(transaction.from)} className="font-mono text-primary hover:underline text-sm">
                                        {truncateString(transaction.from, 6, 4)}
                                    </Link>
                                    <button
                                        onClick={() => handleCopy('from', transaction.from)}
                                        className="btn btn-xs btn-circle"
                                        aria-label="Copy from address"
                                        tabIndex={0}
                                    >
                                        {copied.from ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                    </button>
                                </span>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        <div className="flex flex-col items-center w-full sm:w-1/3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">To</span>
                            {transaction?.to ? (
                                <span className="flex items-center gap-1">
                                    <Link href={getAddressUrl(transaction.to)} className="font-mono text-primary hover:underline text-sm">
                                        {truncateString(transaction.to, 6, 4)}
                                    </Link>
                                    <button
                                        onClick={() => handleCopy('to', transaction.to)}
                                        className="btn btn-xs btn-circle"
                                        aria-label="Copy to address"
                                        tabIndex={0}
                                    >
                                        {copied.to ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                    </button>
                                </span>
                            ) : (
                                transaction && transaction.to === null ? (
                                    <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs">Contract Creation</span>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )
                            )}
                        </div>
                        <div className="flex flex-col items-center sm:items-end w-full sm:w-1/3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Amount</span>
                            <span className="font-semibold text-primary text-sm">
                                {transaction?.value !== undefined && transaction?.value !== null
                                    ? formatEth(transaction.value, coinSymbol, coinDecimals)
                                    : <span className="text-gray-400">-</span>
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Professional full details view
    // Field label mapping for user-friendly names
    const fieldLabels = {
        hash: 'Transaction Hash',
        blockNumber: 'Block Number',
        blockHash: 'Block Hash',
        from: 'From',
        to: 'To',
        value: 'Amount',
        gas: 'Gas Limit',
        gasPrice: 'Gas Price',
        maxFeePerGas: 'Max Fee Per Gas',
        maxPriorityFeePerGas: 'Max Priority Fee',
        gasUsed: 'Gas Used',
        cumulativeGasUsed: 'Cumulative Gas Used',
        nonce: 'Nonce',
        status: 'Status',
        contractAddress: 'Contract Address',
        input: 'Input Data',
        timestamp: 'Timestamp',
        type: 'Type',
        index: 'Index',
        logsBloom: 'Logs Bloom',
        // add more as needed
    };
    // Hide technical/empty fields
    const hiddenFields = [
        'accessList', 'blobVersionedHashes', 'root', 'signature', 'provider', 'chainId', 'blobGasPrice', 'blobGasUsed',
        'blobVersionedHashes', 'v', 'r', 's', 'yParity', 'l1BlockNumber', 'l1TxOrigin', 'l1FeeScalar', 'l1GasPrice', 'l1GasUsed', 'l1Fee', 'l1BatchNumber', 'l1BatchTxIndex', 'logs',
        'type', 'index', 'logsBloom', 'data', 'input', 'toJSON', 'confirmations', 'creates', 'raw', 'wait', 'blockHash', // some shown elsewhere or not useful
    ];
    // Grouping helpers
    const mainFields = ['hash', 'from', 'to', 'value', 'blockNumber', 'status', 'timestamp', 'contractAddress'];
    const gasFields = ['gas', 'gasPrice', 'maxFeePerGas', 'maxPriorityFeePerGas', 'gasUsed', 'cumulativeGasUsed'];
    // Status badge
    function renderStatus(val) {
        if (val === true || val === 1 || val === '1') return <span className="badge badge-success">Success</span>;
        if (val === false || val === 0 || val === '0') return <span className="badge badge-error">Failed</span>;
        return <span className="badge badge-neutral">Unknown</span>;
    }
    // Format gas/fee
    function formatGas(val) {
        if (!val) return '-';
        return Number(val).toLocaleString();
    }
    // Format input
    function formatInput(val) {
        if (!val || val === '0x') return <span className="text-gray-400">(empty)</span>;
        return <span className="font-mono break-all">{val}</span>;
    }
    // Main info rows
    const mainRows = mainFields.filter(f => transaction[f] !== undefined && !hiddenFields.includes(f)).map(key => (
        <tr key={key} className="border-b last:border-b-0 hover:bg-base-100/60 transition">
            <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">{fieldLabels[key] || key}</td>
            <td className="py-2 break-all">
                {key === 'hash' ? (
                    <Link href={getTxUrl(transaction[key])} className="text-primary hover:underline font-mono">{transaction[key]}</Link>
                ) : key === 'from' || key === 'to' || key === 'contractAddress' ? (
                    <Link href={getAddressUrl(transaction[key])} className="text-primary hover:underline font-mono">{transaction[key]}</Link>
                ) : key === 'value' ? (
                    <span className="font-mono">{formatEth(transaction[key], coinSymbol, coinDecimals)}</span>
                ) : key === 'status' ? (
                    renderStatus(transaction[key])
                ) : key === 'timestamp' ? (
                    <span>{formatTimeAgo(transaction[key])} <span className="text-xs text-gray-400">({new Date(Number(transaction[key]) * 1000).toLocaleString()})</span></span>
                ) : (
                    <span className="font-mono">{transaction[key]}</span>
                )}
                <button
                    onClick={() => handleCopy(key, transaction[key])}
                    className="ml-2 btn btn-xs btn-circle btn-ghost tooltip"
                    data-tip="Copy"
                    aria-label={`Copy ${key}`}
                    tabIndex={0}
                >
                    {copied[key] ? <FiCheck size={14} /> : <FiCopy size={14} />}
                </button>
            </td>
        </tr>
    ));
    // Gas/fee info rows
    const gasRows = gasFields.filter(f => transaction[f] !== undefined && !hiddenFields.includes(f)).map(key => (
        <tr key={key} className="border-b last:border-b-0 hover:bg-base-100/60 transition">
            <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">{fieldLabels[key] || key}</td>
            <td className="py-2 break-all">
                <span className="font-mono">{formatGas(transaction[key])}</span>
                <button
                    onClick={() => handleCopy(key, transaction[key])}
                    className="ml-2 btn btn-xs btn-circle btn-ghost tooltip"
                    data-tip="Copy"
                    aria-label={`Copy ${key}`}
                    tabIndex={0}
                >
                    {copied[key] ? <FiCheck size={14} /> : <FiCopy size={14} />}
                </button>
            </td>
        </tr>
    ));
    // Extra fields
    const extraRows = Object.entries(transaction).filter(([key, value]) => {
        return !mainFields.includes(key) && !gasFields.includes(key) && !hiddenFields.includes(key) && value !== undefined && value !== null && value !== '';
    }).map(([key, value]) => (
        <tr key={key} className="border-b last:border-b-0 hover:bg-base-100/60 transition">
            <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">{fieldLabels[key] || key}</td>
            <td className="py-2 break-all">
                {key === 'input' || key === 'data' ? formatInput(value) : String(value)}
                <button
                    onClick={() => handleCopy(key, value)}
                    className="ml-2 btn btn-xs btn-circle btn-ghost tooltip"
                    data-tip="Copy"
                    aria-label={`Copy ${key}`}
                    tabIndex={0}
                >
                    {copied[key] ? <FiCheck size={14} /> : <FiCopy size={14} />}
                </button>
            </td>
        </tr>
    ));
    return (
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-primary/10 animate-fade-in">
            <div className="px-6 pt-6 pb-2">
                <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100/80 p-5">
                    <table className="table w-full text-sm">
                        <tbody>
                            {mainRows}
                            {gasRows.length > 0 && <tr><td colSpan={2}><div className="divider my-2">Gas &amp; Fee Info</div></td></tr>}
                            {gasRows}
                            {extraRows.length > 0 && <tr><td colSpan={2}><div className="divider my-2">Advanced</div></td></tr>}
                            {extraRows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 