"use client";

import Link from 'next/link';
import { formatEth, formatTimeAgo } from '../lib/utils';

export default function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return <div className="bg-base-200 rounded-xl p-8 text-center">No transactions found</div>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100/80 p-5">
      <table className="table w-full text-xs md:text-sm">
        <thead style={{
          borderBottom: '1px solid #e5e7eb'
        }}>
          <tr>
            <th>Txn Hash</th>
            <th>Block</th>
            <th>From</th>
            <th>To</th>
            <th>Value</th>
            <th>Age</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            let skipped = 0;
            const rows = transactions.map(tx => {
              if (!tx.hash) {
                skipped++;
                return null;
              }
              return (
                <tr key={tx.hash} className="hover:bg-base-200/60 transition">
                  <td className="font-mono">
                    <Link href={`/tx/${tx.hash}`} className="text-primary hover:underline">{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</Link>
                  </td>
                  <td>
                    <Link href={`/block/${tx.blockNumber}`} className="text-primary hover:underline">{tx.blockNumber}</Link>
                  </td>
                  <td className="font-mono">
                    <Link href={`/address/${tx.from}`} className="hover:underline">{tx.from.slice(0, 8)}...{tx.from.slice(-6)}</Link>
                  </td>
                  <td className="font-mono">
                    <Link href={`/address/${tx.to}`} className="hover:underline">{tx.to ? tx.to.slice(0, 8) + '...' + tx.to.slice(-6) : '-'}</Link>
                  </td>
                  <td>{formatEth(tx.value)}</td>
                  <td>{formatTimeAgo(tx.timestamp)}</td>
                  <td>
                    {tx.status === true || tx.status === 1 || tx.status === '1' ? (
                      <span className="badge badge-success">Success</span>
                    ) : (
                      <span className="badge badge-error">Failed</span>
                    )}
                  </td>
                </tr>
              );
            });
            if (skipped > 0) {
              rows.unshift(
                <tr key="skipped-warning">
                  <td colSpan={7} className="text-warning text-xs bg-warning/10">
                    {skipped} transaction(s) skipped due to missing hash.
                  </td>
                </tr>
              );
            }
            return rows;
          })()}

        </tbody>
      </table>
    </div>
  );
}
