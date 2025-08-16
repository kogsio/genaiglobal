import React, { useEffect, useRef } from "react";

interface ConstellationParticlesProps {
  className?: string;
  density?: number; // number of particles base
}

// Lightweight canvas constellation with mouse linking
const ConstellationParticles: React.FC<ConstellationParticlesProps> = ({ className, density = 70 }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let width = 0, height = 0;

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let points: P[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor(density * (width * height) / (1280 * 720));
      points = new Array(Math.max(20, count)).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.2 + 0.4,
      }));
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse.current = null; };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Update
      for (const p of points) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // Links
      const linkDist = Math.min(140, Math.max(80, Math.hypot(width, height) / 16));
      ctx.strokeStyle = `hsl(var(--accent) / 0.35)`;
      ctx.lineWidth = 1;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            ctx.globalAlpha = 1 - d / linkDist;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Draw points
      ctx.fillStyle = `hsl(var(--accent))`;
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mouse links
      if (mouse.current) {
        const m = mouse.current;
        for (const p of points) {
          const d = Math.hypot(p.x - m.x, p.y - m.y);
          if (d < linkDist) {
            ctx.globalAlpha = 1 - d / linkDist;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `hsl(var(--accent) / 0.5)`;
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [density]);

  return <canvas ref={ref} className={"pointer-events-none absolute inset-0 z-0 " + (className || "")} />;
};

export default ConstellationParticles;
