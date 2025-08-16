import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuroraNebulaProps {
  className?: string;
}

// Aurora layers + starfield parallax accents (CSS backgrounds), ultra light
const AuroraNebula = memo(({ className }: AuroraNebulaProps) => {
  return (
    <div className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}>
      {/* Subtle dotted star grid */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ background: "radial-gradient(hsl(var(--accent)/0.12) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        animate={{ x: [0, -10, 0], y: [0, -6, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Aurora blobs */}
      <motion.div
        className="absolute -top-24 -left-24 h-[60vh] w-[60vw] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--accent)/0.35), transparent 70%)", mixBlendMode: "screen" }}
        animate={{ x: [0, 30, -15, 0], y: [0, -10, 0, 10] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -top-16 right-[-10%] h-[50vh] w-[45vw] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--accent)/0.28), transparent 70%)", mixBlendMode: "screen" }}
        animate={{ x: [0, -20, 10, 0], y: [0, 12, -8, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-1/2 h-[45vh] w-[50vw] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--accent)/0.22), transparent 70%)", mixBlendMode: "screen" }}
        animate={{ x: [0, 10, -10, 0], y: [0, -6, 8, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
});

export default AuroraNebula;
