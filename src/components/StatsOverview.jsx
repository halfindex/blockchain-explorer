"use client";

import { formatNumber } from '../lib/utils';
import { FiBox, FiClock, FiDatabase, FiActivity } from 'react-icons/fi';

export default function StatsOverview({ stats }) {
    if (!stats) return null;

    return (
        <div className="bg-card-bg dark:bg-card-bg border border-card-border rounded-xl shadow-card overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0">
                <div className="border-b sm:border-b md:border-r border-card-border p-5 md:p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-3">
                            <div className="bg-primary/10 rounded-full p-2 mr-3">
                                <FiBox className="text-primary text-lg" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">LATEST BLOCK</span>
                        </div>
                        <span className="text-3xl font-bold text-primary">{formatNumber(stats.latestBlock)}</span>
                    </div>
                </div>

                <div className="border-b md:border-r border-card-border p-5 md:p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-3">
                            <div className="bg-secondary/10 rounded-full p-2 mr-3">
                                <FiClock className="text-secondary text-lg" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">AVG BLOCK TIME</span>
                        </div>
                        <span className="text-3xl font-bold text-secondary">{stats.avgBlockTime}s</span>
                    </div>
                </div>

                <div className="border-b sm:border-b-0 sm:border-r md:border-r border-card-border p-5 md:p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-3">
                            <div className="bg-accent/10 rounded-full p-2 mr-3">
                                <FiDatabase className="text-accent text-lg" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">TRANSACTIONS</span>
                        </div>
                        <span className="text-3xl font-bold text-accent">{formatNumber(stats.totalTxs)}</span>
                    </div>
                </div>

                <div className="p-5 md:p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-3">
                            <div className="bg-info/10 rounded-full p-2 mr-3">
                                <FiActivity className="text-info text-lg" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">GAS PRICE</span>
                        </div>
                        <span className="text-3xl font-bold text-info">{stats.gasPrice} Gwei</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 