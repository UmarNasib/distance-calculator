"use client";

import { useState } from "react";

type InputMode = "decimal" | "dms";

// Defined explicit type for Direction to satisfy Vercel Linter
type Direction = "N" | "S" | "E" | "W";

interface DmsPoint {
  deg: string;
  min: string;
  sec: string;
  dir: Direction;
}

export default function DistanceCalculator() {
  const [mode, setMode] = useState<InputMode>("decimal");

  const [decInputs, setDecInputs] = useState({
    lat1: "", lon1: "",
    lat2: "", lon2: "",
  });

  const [dmsInputs, setDmsInputs] = useState({
    p1Lat: { deg: "", min: "", sec: "", dir: "N" } as DmsPoint,
    p1Lon: { deg: "", min: "", sec: "", dir: "W" } as DmsPoint,
    p2Lat: { deg: "", min: "", sec: "", dir: "N" } as DmsPoint,
    p2Lon: { deg: "", min: "", sec: "", dir: "W" } as DmsPoint,
  });

  const [results, setResults] = useState({ km: "", miles: "", nautical: "" });
  const [error, setError] = useState("");

  const handleDecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecInputs({ ...decInputs, [e.target.name]: e.target.value });
  };

  const handleDmsChange = (
    point: "p1Lat" | "p1Lon" | "p2Lat" | "p2Lon",
    field: keyof DmsPoint,
    value: string
  ) => {
    setDmsInputs((prev) => ({
      ...prev,
      [point]: { ...prev[point], [field]: value },
    }));
  };

  const clearFields = () => {
    setDecInputs({ lat1: "", lon1: "", lat2: "", lon2: "" });
    setDmsInputs({
      p1Lat: { deg: "", min: "", sec: "", dir: "N" },
      p1Lon: { deg: "", min: "", sec: "", dir: "W" },
      p2Lat: { deg: "", min: "", sec: "", dir: "N" },
      p2Lon: { deg: "", min: "", sec: "", dir: "W" },
    });
    setResults({ km: "", miles: "", nautical: "" });
    setError("");
  };

  const convertDmsToDecimal = (p: DmsPoint): number => {
    const d = parseFloat(p.deg) || 0;
    const m = parseFloat(p.min) || 0;
    const s = parseFloat(p.sec) || 0;
    let decimal = d + m / 60 + s / 3600;
    if (p.dir === "S" || p.dir === "W") {
      decimal = decimal * -1;
    }
    return decimal;
  };

  const calculateDistance = () => {
    setError("");
    let lat1, lon1, lat2, lon2;

    if (mode === "decimal") {
      lat1 = parseFloat(decInputs.lat1);
      lon1 = parseFloat(decInputs.lon1);
      lat2 = parseFloat(decInputs.lat2);
      lon2 = parseFloat(decInputs.lon2);
    } else {
      lat1 = convertDmsToDecimal(dmsInputs.p1Lat);
      lon1 = convertDmsToDecimal(dmsInputs.p1Lon);
      lat2 = convertDmsToDecimal(dmsInputs.p2Lat);
      lon2 = convertDmsToDecimal(dmsInputs.p2Lon);
    }

    if ([lat1, lon1, lat2, lon2].some((val) => isNaN(val))) {
      setError("Please check your coordinates. Some fields are empty or invalid.");
      return;
    }

    const R = 6371; // km
    const toRad = (val: number) => (val * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dKm = R * c;

    setResults({
      km: dKm.toFixed(2),
      miles: (dKm * 0.621371).toFixed(2),
      nautical: (dKm * 0.539957).toFixed(2),
    });
  };

  return (
    <div className="w-full max-w-5xl bg-white shadow-2xl rounded-xl overflow-hidden font-sans border border-gray-200">

      {/* HEADER */}
      <div className="bg-[#2c3e50] text-white py-4 px-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-wide uppercase">Distance Calculator</h1>
        <p className="text-gray-300 text-xs mt-1">Great circle distance between two points</p>
      </div>

      {/* TABS */}
      <div className="flex bg-gray-100 border-b border-gray-300">
        <button
          onClick={() => setMode("decimal")}
          className={`flex-1 py-3 text-sm font-bold uppercase transition-all ${
            mode === "decimal"
              ? "bg-white text-blue-800 border-t-4 border-blue-600 shadow-sm"
              : "text-gray-500 hover:bg-gray-200"
          }`}
        >
          Decimal Coordinates
        </button>
        <button
          onClick={() => setMode("dms")}
          className={`flex-1 py-3 text-sm font-bold uppercase transition-all ${
            mode === "dms"
              ? "bg-white text-blue-800 border-t-4 border-blue-600 shadow-sm"
              : "text-gray-500 hover:bg-gray-200"
          }`}
        >
          Degree - Minute - Second
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="p-6 flex flex-col gap-6 bg-[#fdfdfd]">

        {/* INPUTS SECTION */}
        <div>
          {mode === "decimal" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Point 1 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-[#4a6b8a] text-white px-4 py-2 font-bold text-xs tracking-wide uppercase">Point 1</div>
                <div className="p-4 flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-wide">Latitude</label>
                    <input
                      name="lat1"
                      value={decInputs.lat1}
                      onChange={handleDecChange}
                      placeholder="38.8976"
                      className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-wide">Longitude</label>
                    <input
                      name="lon1"
                      value={decInputs.lon1}
                      onChange={handleDecChange}
                      placeholder="-77.0366"
                      className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Point 2 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-[#4a6b8a] text-white px-4 py-2 font-bold text-xs tracking-wide uppercase">Point 2</div>
                <div className="p-4 flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-wide">Latitude</label>
                    <input
                      name="lat2"
                      value={decInputs.lat2}
                      onChange={handleDecChange}
                      placeholder="39.9496"
                      className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-wide">Longitude</label>
                    <input
                      name="lon2"
                      value={decInputs.lon2}
                      onChange={handleDecChange}
                      placeholder="-75.1503"
                      className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // DMS GRID LAYOUT
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Point 1 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-[#4a6b8a] text-white px-4 py-2 font-bold text-xs tracking-wide uppercase">Point 1</div>
                <div className="p-4 flex flex-col gap-3">
                  {/* Latitude */}
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-500 text-[10px] uppercase">Latitude</span>
                    <div className="flex gap-1">
                      <div className="relative flex-1">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-center text-sm focus:border-blue-500 outline-none" placeholder="38" value={dmsInputs.p1Lat.deg} onChange={(e) => handleDmsChange("p1Lat", "deg", e.target.value)} />
                        <span className="absolute right-1 top-0 text-[9px] text-gray-400 font-bold">DEG</span>
                      </div>
                      <div className="relative flex-1">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-center text-sm focus:border-blue-500 outline-none" placeholder="53" value={dmsInputs.p1Lat.min} onChange={(e) => handleDmsChange("p1Lat", "min", e.target.value)} />
                        <span className="absolute right-1 top-0 text-[9px] text-gray-400 font-bold">MIN</span>
                      </div>
                      <div className="relative flex-[1.2]">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-center text-sm focus:border-blue-500 outline-none" placeholder="51.36" value={dmsInputs.p1Lat.sec} onChange={(e) => handleDmsChange("p1Lat", "sec", e.target.value)} />
                        <span className="absolute right-1 top-0 text-[9px] text-gray-400 font-bold">SEC</span>
                      </div>
                      <select className="w-12 p-1 border border-gray-300 rounded font-bold text-gray-700 text-sm bg-white cursor-pointer" value={dmsInputs.p1Lat.dir} onChange={(e) => handleDmsChange("p1Lat", "dir", e.target.value as Direction)}>
                        <option value="N">N</option><option value="S">S</option>
                      </select>
                    </div>
                  </div>
                  {/* Longitude */}
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-500 text-[10px] uppercase">Longitude</span>
                    <div className="flex gap-1">
                      <div className="relative flex-1">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-center text-sm focus:border-blue-500 outline-none" placeholder="77" value={dmsInputs.p1Lon.deg} onChange={(e) => handleDmsChange("p1Lon", "deg", e.target.value)} />
                        <span className="absolute right-1 top-0 text-[9px] text-gray-400 font-bold">DEG</span>
                      </div>
                      <div className="relative flex-1">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-center text-sm focus:border-blue-500 outline-none" placeholder="02" value={dmsInputs.p1Lon.min} onChange={(e) => handleDmsChange("p1Lon", "min", e.target.value)} />
                        <span className="absolute right-1 top-0 text-[9px] text-gray-400 font-bold">MIN</span>
                      </div>
                      <div className="relative flex-[1.2]">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-center text-sm focus:border-blue-500 outline-none" placeholder="11.76" value={dmsInputs.p1Lon.sec} onChange={(e) => handleDmsChange("p1Lon", "sec", e.target.value)} />
                        <span className="absolute right-1 top-0 text-[9px] text-gray-400 font-bold">SEC</span>
                      </div>
                      <select className="w-12 p-1 border border-gray-300 rounded font-bold text-gray-700 text-sm bg-white cursor-pointer" value={dmsInputs.p1Lon.dir} onChange={(e) => handleDmsChange("p1Lon", "dir", e.target.value as Direction)}>
                        <option value="E">E</option><option value="W">W</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Point 2 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-[#4a6b8a] text-white px-4 py-2 font-bold text-xs tracking-wide uppercase">Point 2</div>
                <div className="p-4 flex flex-col gap-3">
                  {/* Latitude */}
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-500 text-[10px] uppercase">Latitude</span>
                    <div className="flex gap-1">
                      <div className="relative flex-1">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-center text-sm focus:border-blue-500 outline-none" placeholder="39" value={dmsInputs.p2Lat.deg} onChange={(e) => handleDmsChange("p2Lat", "deg", e.target.value)} />
                        <span className="absolute right-1 top-0 text-[9px] text-gray-400 font-bold">DEG</span>
                      </div>
                      <div className="relative flex-1">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-center text-sm focus:border-blue-500 outline-none" placeholder="56" value={dmsInputs.p2Lat.min} onChange={(e) => handleDmsChange("p2Lat", "min", e.target.value)} />
                        <span className="absolute right-1 top-0 text-[9px] text-gray-400 font-bold">MIN</span>
                      </div>
                      <div className="relative flex-[1.2]">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-center text-sm focus:border-blue-500 outline-none" placeholder="58.56" value={dmsInputs.p2Lat.sec} onChange={(e) => handleDmsChange("p2Lat", "sec", e.target.value)} />
                        <span className="absolute right-1 top-0 text-[9px] text-gray-400 font-bold">SEC</span>
                      </div>
                      <select className="w-12 p-1 border border-gray-300 rounded font-bold text-gray-700 text-sm bg-white cursor-pointer" value={dmsInputs.p2Lat.dir} onChange={(e) => handleDmsChange("p2Lat", "dir", e.target.value as Direction)}>
                        <option value="N">N</option><option value="S">S</option>
                      </select>
                    </div>
                  </div>
                  {/* Longitude */}
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-500 text-[10px] uppercase">Longitude</span>
                    <div className="flex gap-1">
                      <div className="relative flex-1">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-center text-sm focus:border-blue-500 outline-none" placeholder="75" value={dmsInputs.p2Lon.deg} onChange={(e) => handleDmsChange("p2Lon", "deg", e.target.value)} />
                        <span className="absolute right-1 top-0 text-[9px] text-gray-400 font-bold">DEG</span>
                      </div>
                      <div className="relative flex-1">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-center text-sm focus:border-blue-500 outline-none" placeholder="09" value={dmsInputs.p2Lon.min} onChange={(e) => handleDmsChange("p2Lon", "min", e.target.value)} />
                        <span className="absolute right-1 top-0 text-[9px] text-gray-400 font-bold">MIN</span>
                      </div>
                      <div className="relative flex-[1.2]">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-center text-sm focus:border-blue-500 outline-none" placeholder="01.08" value={dmsInputs.p2Lon.sec} onChange={(e) => handleDmsChange("p2Lon", "sec", e.target.value)} />
                        <span className="absolute right-1 top-0 text-[9px] text-gray-400 font-bold">SEC</span>
                      </div>
                      <select className="w-12 p-1 border border-gray-300 rounded font-bold text-gray-700 text-sm bg-white cursor-pointer" value={dmsInputs.p2Lon.dir} onChange={(e) => handleDmsChange("p2Lon", "dir", e.target.value as Direction)}>
                        <option value="E">E</option><option value="W">W</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded border border-red-100">{error}</p>}

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
          <button
            onClick={calculateDistance}
            className="flex items-center justify-center gap-2 bg-[#5c7c34] hover:bg-[#4a652a] text-white px-8 py-3 rounded-lg font-bold text-base shadow-md transition-all active:scale-[0.98] w-full sm:w-auto"
          >
            CALCULATE
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
          <button
            onClick={clearFields}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold text-base shadow-sm w-full sm:w-auto transition-colors"
          >
            Clear
          </button>
        </div>

        {/* RESULTS - Compact */}
        <div className="bg-[#eaf4fa] border border-[#bce8f1] rounded-lg p-4 text-[#31708f]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-black mb-1 uppercase">Kilometers</label>
              <div className="relative">
                <input type="text" readOnly value={results.km} placeholder="0.00" className="w-full p-2 bg-white border border-[#bce8f1] rounded text-gray-800 text-lg font-bold shadow-sm outline-none" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">km</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-black mb-1 uppercase">Statute Miles</label>
              <div className="relative">
                <input type="text" readOnly value={results.miles} placeholder="0.00" className="w-full p-2 bg-white border border-[#bce8f1] rounded text-gray-800 text-lg font-bold shadow-sm outline-none" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">mi</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-black mb-1 uppercase">Nautical Miles</label>
              <div className="relative">
                <input type="text" readOnly value={results.nautical} placeholder="0.00" className="w-full p-2 bg-white border border-[#bce8f1] rounded text-gray-800 text-lg font-bold shadow-sm outline-none" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">nm</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}