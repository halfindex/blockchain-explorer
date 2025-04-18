"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BiSearch } from 'react-icons/bi';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../../public/logo.png';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    // Check for system preference on initial load
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            setIsDarkMode(darkModeMediaQuery.matches);

            // Set initial theme
            document.documentElement.setAttribute(
                'data-theme',
                darkModeMediaQuery.matches ? 'rdtDarkTheme' : 'rdtLightTheme'
            );

            // Listen for changes
            const handler = (e) => {
                setIsDarkMode(e.matches);
                document.documentElement.setAttribute(
                    'data-theme',
                    e.matches ? 'rdtDarkTheme' : 'rdtLightTheme'
                );
            };

            darkModeMediaQuery.addEventListener('change', handler);
            return () => darkModeMediaQuery.removeEventListener('change', handler);
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) return;

        const query = searchQuery.trim();

        // Check if it's a block number (all digits)
        if (/^\d+$/.test(query)) {
            router.push(`/block/${query}`);
            return;
        }

        // Check if it looks like a transaction hash (0x + 64 hex chars)
        if (/^0x[a-fA-F0-9]{64}$/.test(query)) {
            router.push(`/tx/${query}`);
            return;
        }

        // Check if it looks like an address (0x + 40 hex chars)
        if (/^0x[a-fA-F0-9]{40}$/.test(query)) {
            router.push(`/address/${query}`);
            return;
        }

        // Default to search results page
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setIsMobileMenuOpen(false);
    };

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        document.documentElement.setAttribute(
            'data-theme',
            newTheme ? 'rdtDarkTheme' : 'rdtLightTheme'
        );
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 border-b border-card-border shadow-lg backdrop-blur-xl transition-all duration-300">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-2xl font-extrabold text-primary flex items-center gap-2 tracking-tight hover:opacity-90 transition">
                            <Image src={logo} alt="Logo" width={100} height={100} />
                        </Link>

                        <nav className="hidden md:flex">
                            <ul className="flex space-x-6">
                                <li>
                                    <a href="/" className="hover:text-primary transition-colors font-medium">
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a href="/blocks" className="hover:text-primary transition-colors font-medium">
                                        Blocks
                                    </a>
                                </li>
                                <li>
                                    <a href="/txs" className="hover:text-primary transition-colors font-medium">
                                        Transactions
                                    </a>
                                </li>

                            </ul>
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-3 flex-1 max-w-md ml-6">
                        <form onSubmit={handleSearch} className="relative flex-grow">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by address, tx hash, block..."
                                className="search-input pr-10"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary transition-colors"
                                aria-label="Search"
                            >
                                <BiSearch size={20} />
                            </button>
                        </form>

                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMobileMenu}
                            className="btn btn-circle btn-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 ml-2"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pt-4 pb-2 animate-fade-in">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by address, tx hash, block..."
                                    className="search-input pr-10"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary"
                                    aria-label="Search"
                                >
                                    <BiSearch size={20} />
                                </button>
                            </div>
                        </form>

                        <nav className="mb-2">
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="/"
                                        className="block py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/blocks"
                                        className="block py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Blocks
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/txs"
                                        className="block py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Transactions
                                    </Link>
                                </li>

                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
} 