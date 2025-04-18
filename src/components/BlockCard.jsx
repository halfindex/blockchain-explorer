"use client";

import Link from 'next/link';
import { formatTimeAgo, formatNumber, formatBytes } from '../lib/utils';
import { FiBox, FiClock, FiDatabase, FiUser, FiCopy, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

export default function BlockCard({ block, showFullDetails = false }) {
    const [copied, setCopied] = useState({});
    const handleCopy = async (key, value) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(prev => ({ ...prev, [key]: true }));
            setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 1500);
        } catch (err) {
            // ignore
        }
    }
    if (!block) return null;

    // Ensure we have proper data
    const blockNumber = Number(block.number);
    const transactions = Array.isArray(block.transactions)
        ? block.transactions.length
        : (typeof block.transactions === 'number' ? block.transactions : 0);

    return (
        <div className="bg-white/80 rounded-lg dark:bg-gray-900/80 border border-primary/10 hover:border-primary/30 transition-all duration-200 hover:-translate-y-1 backdrop-blur-md animate-fade-in">
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center">
                        <div className="bg-primary/10 rounded-full p-2.5 mr-4 shadow-sm">
                            <FiBox className="text-primary text-xl" />
                        </div>
                        <div>
                            <Link href={`/block/${blockNumber}`} className="text-2xl font-extrabold text-primary hover:underline transition-colors">
                                Block #{blockNumber}
                            </Link>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <span className="flex items-center">
                                    <FiClock className="mr-1.5 text-secondary" />
                                    {formatTimeAgo(block.timestamp)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <FiDatabase className="mr-1.5 text-accent" />
                            <span className="font-medium">{transactions} txns</span>
                        </div>
                        <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-400">
                            <FiUser className="mr-1.5 text-info" />
                            <Link href="" className="hover:text-primary hover:underline transition-colors font-medium">
                                Private Miner
                            </Link>
                        </div>
                    </div>
                </div>

                {showFullDetails && (
                    <div className="mt-6">
                        <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100/80 p-5">
                            <table className="table w-full text-sm p-5">
                                <tbody>
                                    {/* Block Number */}
                                    <tr>
                                        <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Block Number</td>
                                        <td className="py-2 break-all font-mono flex items-center">
                                            {block.number}
                                            <button
                                                onClick={() => handleCopy('number', block.number)}
                                                className="ml-2 btn btn-xs btn-circle btn-ghost tooltip"
                                                data-tip="Copy"
                                                aria-label="Copy Block Number"
                                                tabIndex={0}
                                            >
                                                {copied['number'] ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Hash */}
                                    <tr>
                                        <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Block Hash</td>
                                        <td className="py-2 break-all font-mono flex items-center">
                                            {block.hash}
                                            <button
                                                onClick={() => handleCopy('hash', block.hash)}
                                                className="ml-2 btn btn-xs btn-circle btn-ghost tooltip"
                                                data-tip="Copy"
                                                aria-label="Copy Block Hash"
                                                tabIndex={0}
                                            >
                                                {copied['hash'] ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Parent Hash */}
                                    <tr>
                                        <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Parent Hash</td>
                                        <td className="py-2 break-all font-mono flex items-center">
                                            {block.parentHash}
                                            <button
                                                onClick={() => handleCopy('parentHash', block.parentHash)}
                                                className="ml-2 btn btn-xs btn-circle btn-ghost tooltip"
                                                data-tip="Copy"
                                                aria-label="Copy Parent Hash"
                                                tabIndex={0}
                                            >
                                                {copied['parentHash'] ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Miner */}
                                    <tr>
                                        <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Miner</td>
                                        <td className="py-2 break-all font-mono flex items-center">
                                            {block.miner}
                                            <button
                                                onClick={() => handleCopy('miner', block.miner)}
                                                className="ml-2 btn btn-xs btn-circle btn-ghost tooltip"
                                                data-tip="Copy"
                                                aria-label="Copy Miner Address"
                                                tabIndex={0}
                                            >
                                                {copied['miner'] ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Timestamp */}
                                    <tr>
                                        <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Timestamp</td>
                                        <td className="py-2 break-all">{formatTimeAgo(block.timestamp)} <span className="text-xs text-gray-400">({new Date(Number(block.timestamp) * 1000).toLocaleString()})</span></td>
                                    </tr>
                                    {/* Gas Used / Gas Limit */}
                                    <tr>
                                        <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Gas Used / Limit</td>
                                        <td className="py-2 break-all font-mono">{formatNumber(block.gasUsed || 0)} / {formatNumber(block.gasLimit || 0)} ({block.gasLimit ? `${((block.gasUsed / block.gasLimit) * 100).toFixed(2)}%` : '0%'})</td>
                                    </tr>
                                    {/* Difficulty */}
                                    {block.difficulty && (
                                        <tr>
                                            <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Difficulty</td>
                                            <td className="py-2 break-all font-mono flex items-center">
                                                {block.difficulty}
                                                <button
                                                    onClick={() => handleCopy('difficulty', block.difficulty)}
                                                    className="ml-2 btn btn-xs btn-circle btn-ghost tooltip"
                                                    data-tip="Copy"
                                                    aria-label="Copy Difficulty"
                                                    tabIndex={0}
                                                >
                                                    {copied['difficulty'] ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                    {/* Total Difficulty */}
                                    {block.totalDifficulty && (
                                        <tr>
                                            <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Total Difficulty</td>
                                            <td className="py-2 break-all font-mono flex items-center">
                                                {block.totalDifficulty}
                                                <button
                                                    onClick={() => handleCopy('totalDifficulty', block.totalDifficulty)}
                                                    className="ml-2 btn btn-xs btn-circle btn-ghost tooltip"
                                                    data-tip="Copy"
                                                    aria-label="Copy Total Difficulty"
                                                    tabIndex={0}
                                                >
                                                    {copied['totalDifficulty'] ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                    {/* Size */}
                                    <tr>
                                        <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Size</td>
                                        <td className="py-2 break-all flex items-center">{formatBytes(block.size || 0)}
                                            <button
                                                onClick={() => handleCopy('size', block.size)}
                                                className="ml-2 btn btn-xs btn-circle btn-ghost tooltip"
                                                data-tip="Copy"
                                                aria-label="Copy Block Size"
                                                tabIndex={0}
                                            >
                                                {copied['size'] ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Nonce */}
                                    {block.nonce && (
                                        <tr>
                                            <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Nonce</td>
                                            <td className="py-2 break-all font-mono flex items-center">
                                                {block.nonce}
                                                <button
                                                    onClick={() => handleCopy('nonce', block.nonce)}
                                                    className="ml-2 btn btn-xs btn-circle btn-ghost tooltip"
                                                    data-tip="Copy"
                                                    aria-label="Copy Nonce"
                                                    tabIndex={0}
                                                >
                                                    {copied['nonce'] ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                    {/* Extra Data */}
                                    {block.extraData && (
                                        <tr>
                                            <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Extra Data</td>
                                            <td className="py-2 break-all font-mono flex items-center">
                                                {block.extraData}
                                                <button
                                                    onClick={() => handleCopy('extraData', block.extraData)}
                                                    className="ml-2 btn btn-xs btn-circle btn-ghost tooltip"
                                                    data-tip="Copy"
                                                    aria-label="Copy Extra Data"
                                                    tabIndex={0}
                                                >
                                                    {copied['extraData'] ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                    {/* Base Fee Per Gas */}
                                    {block.baseFeePerGas && (
                                        <tr>
                                            <td className="font-semibold text-xs text-gray-500 py-2 pr-4 whitespace-nowrap">Base Fee Per Gas</td>
                                            <td className="py-2 break-all font-mono flex items-center">
                                                {block.baseFeePerGas}
                                                <button
                                                    onClick={() => handleCopy('baseFeePerGas', block.baseFeePerGas)}
                                                    className="ml-2 btn btn-xs btn-circle btn-ghost tooltip"
                                                    data-tip="Copy"
                                                    aria-label="Copy Base Fee"
                                                    tabIndex={0}
                                                >
                                                    {copied['baseFeePerGas'] ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 