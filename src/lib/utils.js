import { formatDistanceToNow } from 'date-fns';

/**
 * Format a timestamp to a relative time (e.g., "3 hours ago")
 * @param {number|string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted relative time
 */
export function formatTimeAgo(timestamp) {
    if (!timestamp) return 'N/A';

    try {
        // Convert to milliseconds if needed
        let timeMs;
        if (typeof timestamp === 'string' || typeof timestamp === 'number') {
            // Check if timestamp is in seconds (typical blockchain timestamp)
            const tsNum = Number(timestamp);
            // If timestamp is too small to be milliseconds, assume it's in seconds
            timeMs = tsNum < 1000000000000 ? tsNum * 1000 : tsNum;
        } else {
            timeMs = timestamp;
        }

        const date = new Date(timeMs);

        // Sanity check - if date is invalid or too far in the past/future
        if (isNaN(date.getTime()) || date.getFullYear() < 2000 || date.getFullYear() > 2100) {
            return 'N/A';
        }

        return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
        console.error('Error formatting time ago:', error);
        return 'N/A';
    }
}

/**
 * Format a date to a readable format
 * @param {number|string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp) {
    if (!timestamp) return 'N/A';

    try {
        // Convert to milliseconds if needed
        let timeMs;
        if (typeof timestamp === 'string' || typeof timestamp === 'number') {
            // Check if timestamp is in seconds (typical blockchain timestamp)
            const tsNum = Number(timestamp);
            // If timestamp is too small to be milliseconds, assume it's in seconds
            timeMs = tsNum < 1000000000000 ? tsNum * 1000 : tsNum;
        } else {
            timeMs = timestamp;
        }

        const date = new Date(timeMs);

        // Sanity check - if date is invalid or too far in the past/future
        if (isNaN(date.getTime()) || date.getFullYear() < 2000 || date.getFullYear() > 2100) {
            return 'N/A';
        }

        return date.toLocaleString();
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'N/A';
    }
}

/**
 * Format a number with commas as thousands separators
 * @param {number|string} number - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(number) {
    if (number === undefined || number === null) return 'N/A';
    try {
        return Number(number).toLocaleString();
    } catch {
        return 'N/A';
    }
}

/**
 * Format a value to ETH with proper decimal places
 * @param {string|number} value - Value in wei
 * @returns {string} Formatted ETH value
 */
export function formatEth(value, symbol = 'RDT', decimals = 18) {
    if (!value) return `0 ${symbol}`;
    try {
        // Convert to coin units (divide by 10^decimals)
        const eth = Number(value) / Math.pow(10, decimals);

        // If very small number, show more decimal places
        if (eth < 0.000001) {
            return `${eth.toFixed(10)} ${symbol}`;
        } else if (eth < 0.001) {
            return `${eth.toFixed(6)} ${symbol}`;
        } else {
            return `${eth.toFixed(4)} ${symbol}`;
        }
    } catch {
        return `0 ${symbol}`;
    }
}

/**
 * Truncate a string (like an address or hash) for display
 * @param {string} str - String to truncate
 * @param {number} start - Number of characters to keep at the start
 * @param {number} end - Number of characters to keep at the end
 * @returns {string} Truncated string
 */
export function truncateString(str, start = 6, end = 4) {
    if (!str) return '';
    if (str.length <= start + end) return str;
    return `${str.slice(0, start)}...${str.slice(-end)}`;
}

/**
 * Format bytes to a human-readable size
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted size string
 */
export function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    try {
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    } catch {
        return 'N/A';
    }
}

/**
 * Format gas values to Gwei
 * @param {string|number} gas - Gas value in wei
 * @returns {string} Gas value in Gwei
 */
export function formatGas(gas) {
    if (!gas) return '0 Gwei';
    try {
        // Convert to Gwei (divide by 10^9)
        const gwei = Number(gas) / 1e9;
        return `${gwei.toFixed(2)} Gwei`;
    } catch {
        return '0 Gwei';
    }
}

/**
 * Create a URL for a block
 * @param {string|number} blockNumber - Block number
 * @returns {string} URL for the block
 */
export function getBlockUrl(blockNumber) {
    return `/block/${blockNumber}`;
}

/**
 * Create a URL for a transaction
 * @param {string} txHash - Transaction hash
 * @returns {string} URL for the transaction
 */
export function getTxUrl(txHash) {
    return `/tx/${txHash}`;
}

/**
 * Create a URL for an address
 * @param {string} address - Ethereum address
 * @returns {string} URL for the address
 */
export function getAddressUrl(address) {
    return `/address/${address}`;
}