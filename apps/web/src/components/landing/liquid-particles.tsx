"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  phase: number;
  speed: number;
};

type Pointer = {
  x: number;
  y: number;
  active: boolean;
};

const COLORS = ["#2f6f4e", "#3f805d", "#5f9670", "#82aa88", "#a8c29f"];

function createParticle(width: number, height: number, index: number, total: number): Particle {
  const x = Math.random() * width;
  const y = Math.random() * height;

  return {
    x,
    y,
    previousX: x,
    previousY: y,
    vx: 0,
    vy: 0,
    radius: Math.random() * 2.1 + 0.9,
    alpha: Math.random() * 0.44 + 0.3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.2 + 0.07 + (index / total) * 0.08,
  };
}

export function LiquidParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer: Pointer = { x: 0, y: 0, active: false };
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    let animationFrame = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const particleCount = Math.min(320, Math.max(170, Math.floor((width * height) / 6000)));
      particles = Array.from({ length: particleCount }, (_, index) =>
        createParticle(width, height, index, particleCount),
      );
    };

    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active =
        pointer.x >= 0 && pointer.x <= bounds.width && pointer.y >= 0 && pointer.y <= bounds.height;
    };

    const clear = () => {
      context.clearRect(0, 0, width, height);
    };

    const render = () => {
      frame += prefersReducedMotion.matches ? 0 : 0.007;
      clear();

      particles.forEach((particle) => {
        particle.previousX = particle.x;
        particle.previousY = particle.y;

        const motionScale = prefersReducedMotion.matches ? 0 : 1;
        const flowX = Math.sin(particle.y * 0.014 + frame * 1.3 + particle.phase) * 0.05 * motionScale;
        const flowY = Math.cos(particle.x * 0.01 - frame * 0.85 + particle.phase) * 0.035 * motionScale;
        particle.vx += (particle.speed * 0.025 + flowX) * motionScale;
        particle.vy += flowY * 0.8;

        if (pointer.active && !prefersReducedMotion.matches) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const radius = 165;

          if (distance < radius) {
            const force = ((radius - distance) / radius) ** 2 * 1.55;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
            particle.vx += (-dy / distance) * force * 0.28;
            particle.vy += (dx / distance) * force * 0.28;
          }
        }

        particle.vx *= prefersReducedMotion.matches ? 0 : 0.94;
        particle.vy *= prefersReducedMotion.matches ? 0 : 0.94;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x > width + 24) {
          particle.x = -24;
          particle.previousX = particle.x;
        }
        if (particle.x < -24) {
          particle.x = width + 24;
          particle.previousX = particle.x;
        }
        if (particle.y > height + 24) {
          particle.y = -24;
          particle.previousY = particle.y;
        }
        if (particle.y < -24) {
          particle.y = height + 24;
          particle.previousY = particle.y;
        }
      });

      particles.forEach((particle) => {
        context.globalAlpha = particle.alpha * 0.42;
        context.strokeStyle = particle.color;
        context.lineWidth = particle.radius * 0.75;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(particle.previousX, particle.previousY);
        context.lineTo(particle.x, particle.y);
        context.stroke();

        context.globalAlpha = particle.alpha;
        context.fillStyle = particle.color;
        context.shadowColor = particle.color;
        context.shadowBlur = 8;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      });

      if (pointer.active && !prefersReducedMotion.matches) {
        const pointerGlow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 185);
        pointerGlow.addColorStop(0, "rgba(63, 128, 93, 0.11)");
        pointerGlow.addColorStop(0.45, "rgba(63, 128, 93, 0.035)");
        pointerGlow.addColorStop(1, "rgba(63, 128, 93, 0)");
        context.globalAlpha = 1;
        context.fillStyle = pointerGlow;
        context.beginPath();
        context.arc(pointer.x, pointer.y, 185, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", updatePointer, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(63,128,93,0.15),transparent_38%),linear-gradient(180deg,rgba(250,250,248,0.02),rgba(250,250,248,0.72)_94%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-100" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/55 to-transparent" />
    </div>
  );
}
