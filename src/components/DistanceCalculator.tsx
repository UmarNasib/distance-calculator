"use client";

import { useState } from "react";

export default function DistanceCalculator() {
  const [coords, setCoords] = useState({
    lat1: "",
    lon1: "",
    lat2: "",
    lon2: "",
  });

  const [distance, setDistance] = useState<null | {
    meters: number;
    kilometers: number;
    miles: number;
  }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoords({ ...coords, [e.target.name]: e.target.value });
  };

  const toRad = (value: number) => (value * Math.PI) / 180;

  const calculateDistance = () => {
    const { lat1, lon1, lat2, lon2 } = coords;

    const R = 6371000; // Radius of Earth in meters
    const φ1 = toRad(parseFloat(lat1));
    const φ2 = toRad(parseFloat(lat2));
    const Δφ = toRad(parseFloat(lat2) - parseFloat(lat1));
    const Δλ = toRad(parseFloat(lon2) - parseFloat(lon1));

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const meters = R * c;
    const kilometers = meters / 1000;
    const miles = meters / 1609.34;

    setDistance({ meters, kilometers, miles });
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Distance Calculator</h1>

      <div className="grid grid-cols-2 gap-4">
        <input name="lat1" placeholder="Latitude 1" onChange={handleChange} className="p-2 border rounded" />
        <input name="lon1" placeholder="Longitude 1" onChange={handleChange} className="p-2 border rounded" />
        <input name="lat2" placeholder="Latitude 2" onChange={handleChange} className="p-2 border rounded" />
        <input name="lon2" placeholder="Longitude 2" onChange={handleChange} className="p-2 border rounded" />
      </div>

      <button
        onClick={calculateDistance}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Calculate Distance
      </button>

      {distance && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <p><strong>Meters:</strong> {distance.meters.toFixed(2)} m</p>
          <p><strong>Kilometers:</strong> {distance.kilometers.toFixed(2)} km</p>
          <p><strong>Miles:</strong> {distance.miles.toFixed(2)} mi</p>
        </div>
      )}
    </div>
  );
}