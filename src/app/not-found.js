'use client';

import { Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

function NotFoundContent() {
    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-16">
                <div className="flex flex-col items-center justify-center text-center">
                    <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                    <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
                    <p className="text-lg opacity-80 mb-8 max-w-lg">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <Link href="/" className="btn btn-primary">
                        Return to Homepage
                    </Link>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default function NotFound() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotFoundContent />
        </Suspense>
    );
}