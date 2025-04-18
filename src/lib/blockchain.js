import { ethers } from 'ethers';

// Initialize provider based on environment RPC_URL
const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;

/**
 * Get the latest block number
 * @returns {Promise<number>} The latest block number
 */
export async function getLatestBlockNumber() {
    try {
        return await provider.getBlockNumber();
    } catch (error) {
        console.error('Error getting latest block number:', error);
        throw error;
    }
}

/**
 * Get multiple blocks in a range
 * @param {number} startBlock - Starting block number
 * @param {number} endBlock - Ending block number
 * @returns {Promise<Array>} Array of block data
 */
export async function getBlocksInRange(startBlock, endBlock) {
    try {
        const promises = [];
        for (let i = startBlock; i <= endBlock; i++) {
            promises.push(provider.getBlock(i, true)); // fetch full transactions
        }
        return await Promise.all(promises);
    } catch (error) {
        console.error('Error getting blocks in range:', error);
        throw error;
    }
}

/**
 * Get block details by number or hash
 * @param {string|number} blockHashOrNumber - Block hash or number
 * @returns {Promise<Object>} Block data
 */
export async function getBlockDetails(blockHashOrNumber) {
    try {
        // Handle block number 0 explicitly to avoid any ethers.js issues
        if (blockHashOrNumber === 0) {
            return await provider.getBlock(0, true);
        }

        return await provider.getBlock(blockHashOrNumber, true);
    } catch (error) {
        console.error('Error getting block details:', error);
        return null; // Return null instead of throwing to allow proper error handling
    }
}

/**
 * Get transaction details by hash
 * @param {string} txHash - Transaction hash
 * @returns {Promise<Object>} Transaction data
 */
export async function getTransactionDetails(txHash) {
    try {
        const tx = await provider.getTransaction(txHash);
        const receipt = await provider.getTransactionReceipt(txHash);
        return { ...tx, ...receipt };
    } catch (error) {
        console.error('Error getting transaction details:', error);
        throw error;
    }
}

/**
 * Get transactions for a specific block
 * @param {string|number} blockHashOrNumber - Block hash or number
 * @returns {Promise<Array>} Array of transaction data
 */
export async function getBlockTransactions(blockHashOrNumber) {
    try {
        const block = await provider.getBlock(blockHashOrNumber, true);
        return block.transactions;
    } catch (error) {
        console.error('Error getting block transactions:', error);
        throw error;
    }
}

/**
 * Get address balance
 * @param {string} address - Ethereum address
 * @returns {Promise<string>} Balance in ETH
 */
export async function getAddressBalance(address) {
    try {
        const balance = await provider.getBalance(address);
        return ethers.formatEther(balance);
    } catch (error) {
        console.error('Error getting address balance:', error);
        throw error;
    }
}

/**
 * Check if address is a contract
 * @param {string} address - Ethereum address
 * @returns {Promise<boolean>} True if address is a contract
 */
export async function isContract(address) {
    try {
        const code = await provider.getCode(address);
        return code !== '0x';
    } catch (error) {
        console.error('Error checking if address is contract:', error);
        throw error;
    }
}

/**
 * Get transaction count for an address
 * @param {string} address - Ethereum address
 * @returns {Promise<number>} Transaction count
 */
export async function getTransactionCount(address) {
    try {
        return await provider.getTransactionCount(address);
    } catch (error) {
        console.error('Error getting transaction count:', error);
        throw error;
    }
}

/**
 * Format a hash string to be displayed (truncated)
 * @param {string} hash - Full hash string
 * @param {number} length - Length to display on each side
 * @returns {string} Truncated hash
 */
export function formatHash(hash, length = 6) {
    if (!hash) return '';
    return `${hash.substring(0, 2 + length)}...${hash.substring(hash.length - length)}`;
}

/**
 * Convert Wei to ETH
 * @param {string} wei - Wei amount as string
 * @returns {string} ETH amount formatted
 */
export function weiToEth(wei) {


    if (!wei) return '0';
    return ethers.formatEther(wei);
}

/**
 * Get basic network info
 * @returns {Promise<Object>} Network information
 */
export async function getNetworkInfo() {
    return {
        chainId,
        name: process.env.NEXT_PUBLIC_APP_NAME,
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL
    };
}

// Explicit named export for compatibility
export { getBlockDetails as getBlockByNumber };