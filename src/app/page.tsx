'use client';

import DistanceCalculator from "@/components/DistanceCalculator";
import '../styles/globals.css';

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <DistanceCalculator />
    </main>
  );
}