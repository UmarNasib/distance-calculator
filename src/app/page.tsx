'use client';

import DistanceCalculator from "@/components/DistanceCalculator";
import '../styles/globals.css';

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-[#ecece8]"
      style={{ fontFamily: '"Arial", "Bangla708", sans-serif' }}  // Correct font family format
    >
      <DistanceCalculator />
    </main>
  );
}