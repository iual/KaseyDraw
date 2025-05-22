// LotteryDrawPage.jsx (JavaScript version with local Button component)
// Interactive raffle page for drawing table and seat numbers with configurable upper limits.
// Built with React, TailwindCSS, Framer Motion, lucide-react icons, and canvas-confetti.
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dice3, RefreshCcw } from "lucide-react";
import confetti from "canvas-confetti";

// Simple Tailwind styled button (replaces shadcn/ui dependency)
function Button({ children, className = "", variant = "primary", ...props }) {
  const base =
    "px-5 py-2 rounded-xl font-medium transition-transform active:scale-95 disabled:opacity-50";
  const variants = {
    primary:
      "bg-white/20 hover:bg-white/30 backdrop-blur text-white shadow-md",
    secondary:
      "bg-white text-indigo-700 hover:bg-indigo-100 shadow-md",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Animation timing
const FLASH_COUNT = 50; // number of interim flashes before final result
const FLASH_INTERVAL = 100; // milliseconds between flashes

export default function LotteryDrawPage() {
  // Upper‑limit states (editable by user)
  const [tableMax, setTableMax] = useState(30);
  const [seatMax, setSeatMax] = useState(10);

  // Draw results
  const [table, setTable] = useState(null);
  const [seat, setSeat] = useState(null);
  const [rolling, setRolling] = useState(false);

  // Core draw logic with animated shuffle
  const roll = (type) => {
    if (rolling) return;
    setRolling(true);

    let flashes = FLASH_COUNT;
    const id = setInterval(() => {
      const max = type === "table" ? tableMax : seatMax;
      const value = Math.floor(Math.random() * max) + 1;
      if (type === "table") {
        setTable(value);
      } else {
        setSeat(value);
      }
      flashes -= 1;
      if (flashes <= 0) {
        clearInterval(id);
        setRolling(false);
        // Confetti explosion 🎉
        confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
      }
    }, FLASH_INTERVAL);
  };

  const reset = () => {
    setTable(null);
    setSeat(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600 text-white p-4 select-none">
      <h1 className="text-5xl font-extrabold mb-8 drop-shadow-xl tracking-tight">东营喜宴</h1>

      {/* Config inputs */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <label className="flex flex-col items-start">
          <span className="mb-1 text-sm font-medium">桌号上限 (Table Max)</span>
          <input
            type="number"
            min={1}
            value={tableMax}
            onChange={(e) => setTableMax(Math.max(1, +e.target.value))}
            className="w-36 px-3 py-2 rounded-xl text-black focus:outline-none focus:ring-4 focus:ring-purple-400"
          />
        </label>

        <label className="flex flex-col items-start">
          <span className="mb-1 text-sm font-medium">座位号上限 (Seat Max)</span>
          <input
            type="number"
            min={1}
            value={seatMax}
            onChange={(e) => setSeatMax(Math.max(1, +e.target.value))}
            className="w-36 px-3 py-2 rounded-xl text-black focus:outline-none focus:ring-4 focus:ring-pink-400"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        {/* Table draw card */}
        <motion.div
          layout
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-10 shadow-2xl flex flex-col items-center"
        >
          <span className="text-xl mb-4 flex items-center gap-2 font-medium">
            <Dice3 className="w-6 h-6" /> 桌号 (Table)
          </span>
          <AnimatePresence mode="wait">
            {table !== null && (
              <motion.span
                key={table}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="text-8xl font-black tracking-widest"
              >
                {table}
              </motion.span>
            )}
          </AnimatePresence>
          <Button
            onClick={() => roll("table")}
            disabled={rolling}
            className="mt-8 w-40 text-lg"
          >
            抽桌号
          </Button>
        </motion.div>

        {/* Seat draw card */}
        <motion.div
          layout
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-10 shadow-2xl flex flex-col items-center"
        >
          <span className="text-xl mb-4 flex items-center gap-2 font-medium">
            <Dice3 className="w-6 h-6" /> 座位号 (Seat)
          </span>
          <AnimatePresence mode="wait">
            {seat !== null && (
              <motion.span
                key={seat}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="text-8xl font-black tracking-widest"
              >
                {seat}
              </motion.span>
            )}
          </AnimatePresence>
          <Button
            onClick={() => roll("seat")}
            disabled={rolling}
            className="mt-8 w-40 text-lg"
          >
            抽座位
          </Button>
        </motion.div>
      </div>

      <Button
        variant="secondary"
        className="mt-12 flex items-center gap-2 px-6 py-3"
        onClick={reset}
      >
        <RefreshCcw className="w-4 h-4" /> 重置
      </Button>

      <footer className="mt-12 text-xs opacity-70">
        © {new Date().getFullYear()} Lucky Draw • Powered by React & Tailwind
      </footer>
    </div>
  );
}

