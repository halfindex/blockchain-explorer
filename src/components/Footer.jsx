"use client";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white/80 dark:bg-gray-900/80 py-12 border-t border-card-border shadow-inner backdrop-blur-xl">
            <div className="container mx-auto px-4">


                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="inline-block align-middle mr-1">&copy;</span>{currentYear} <span className="font-semibold text-primary">RDT Chain Explorer</span>. All rights reserved.
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs mr-2 font-mono shadow-sm">Chain ID:</span>
                        <span className="text-primary font-bold tracking-wide text-base">{process.env.NEXT_PUBLIC_CHAIN_ID}</span>
                    </p>
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={async () => {
                                if (typeof window === 'undefined' || !window.ethereum) {
                                    alert('MetaMask is not available.');
                                    return;
                                }
                                try {
                                    await window.ethereum.request({
                                        method: 'wallet_addEthereumChain',
                                        params: [
                                            {
                                                chainId: '0x' + (Number(process.env.NEXT_PUBLIC_CHAIN_ID)).toString(16),
                                                chainName: process.env.NEXT_PUBLIC_APP_NAME || 'RDT Chain',
                                                rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL],
                                                nativeCurrency: {
                                                    name: process.env.NEXT_PUBLIC_COIN,
                                                    symbol: process.env.NEXT_PUBLIC_COIN,
                                                    decimals: process.env.NEXT_PUBLIC_DECIMALS,
                                                },
                                                blockExplorerUrls: [window.location.origin],
                                            },
                                        ],
                                    });
                                } catch (err) {
                                    if (err.code !== 4001) alert('Could not add to MetaMask: ' + err.message);
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold shadow transition-colors text-sm"
                            type="button"
                        >
                            <svg width="20" height="20" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><g><polygon fill="#E2761B" points="36.6,1.1 21,11.1 23.8,5.1 " /><polygon fill="#E4761B" points="1.4,1.1 14.2,11.2 13.6,5.1 " /><polygon fill="#D7C1B3" points="30.6,27.7 26.1,34.4 35.5,37.1 38,27.9 " /><polygon fill="#D7C1B3" points="0,27.9 2.5,37.1 11.9,34.4 7.4,27.7 " /><polygon fill="#EA8D3A" points="10.7,16.8 8.1,21.1 18.2,21.6 17.8,10.1 " /><polygon fill="#EA8D3A" points="27.3,16.8 20.2,10.1 19.9,21.6 29.9,21.1 " /><polygon fill="#F6E7D0" points="11.9,34.4 17.7,31.6 12.7,27.7 " /><polygon fill="#F6E7D0" points="26.1,34.4 25.3,27.7 20.2,31.6 " /><polygon fill="#D7C1B3" points="20.2,31.6 25.3,27.7 24.9,24.3 13.1,24.3 12.7,27.7 17.7,31.6 " /><polygon fill="#E4761B" points="11.9,34.4 12.7,27.7 7.4,27.7 " /><polygon fill="#E4761B" points="25.3,27.7 26.1,34.4 30.6,27.7 " /><polygon fill="#D7C1B3" points="30.6,27.7 24.9,24.3 29.9,21.1 " /><polygon fill="#D7C1B3" points="7.4,27.7 13.1,24.3 8.1,21.1 " /><polygon fill="#F6E7D0" points="29.9,21.1 24.9,24.3 25.3,27.7 30.6,27.7 " /><polygon fill="#F6E7D0" points="7.4,27.7 12.7,27.7 13.1,24.3 7.4,27.7 " /><polygon fill="#F6E7D0" points="13.1,24.3 12.7,27.7 17.7,31.6 20.2,31.6 25.3,27.7 24.9,24.3 13.1,24.3 " /></g></svg>
                            Add to MetaMask
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
} 