"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Bar chart: Number of transactions per block for the latest blocks
export default function BlockTxVolumeChart({ blocks }) {
  if (!blocks || blocks.length === 0) return null;
  const sorted = [...blocks].sort((a, b) => a.number - b.number);
  const labels = sorted.map((b) => `#${b.number}`);
  const txCounts = sorted.map((b) => b.transactions?.length || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Txs per Block",
        data: txCounts,
        backgroundColor: "#3b82f6",
        borderRadius: 6,
        barThickness: 32,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Transactions per Block (last 10 blocks)",
        color: "#0e1a2b",
        font: { size: 18, weight: "bold" },
        padding: { bottom: 12 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `Block ${ctx.label}: ${ctx.parsed.y} txs`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b", font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#64748b", font: { size: 12 } },
        grid: { color: "#e5e7eb" },
        title: { display: true, text: "Tx Count", color: "#64748b" },
      },
    },
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-12 mb-8 bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-base-200 animate-fade-in">
      <Bar data={data} options={options} height={280} />
    </div>
  );
}
