"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Show value (amount) of last N transactions as a line chart
export default function TxValueLineChart({ transactions }) {
  if (!transactions || transactions.length === 0) return null;
  const { formatEth } = require('../lib/utils');
  // Most recent first, so reverse to show oldest to newest
  const txs = [...transactions].reverse();
  const labels = txs.map((tx, i) => `#${tx.hash?.slice(0, 8) || i}`);
  const values = txs.map((tx) => {
    if (!tx.value) return 0;
    const val = typeof tx.value === 'string' ? tx.value : tx.value.toString();
    return Number(formatEth(val, '', 18).split(' ')[0]);
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Tx Value (RDT)',
        data: values,
        fill: false,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.3)',
        tension: 0.3,
        pointRadius: 2.5,
        pointBackgroundColor: '#3b82f6',
        pointBorderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Transaction Value Trend (last 100 txs)',
        color: '#0e1a2b',
        font: { size: 18, weight: 'bold' },
        padding: { bottom: 12 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `Value: ${ctx.parsed.y} RDT`,
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#64748b', font: { size: 12 } },
        title: { display: true, text: 'RDT', color: '#64748b' },
      },
    },
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-12 mb-8 bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-base-200 animate-fade-in">
      <Line data={data} options={options} height={280} />
    </div>
  );
}
