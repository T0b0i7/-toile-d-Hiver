
import React, { useEffect, useRef } from 'react';

interface CinematicSceneProps {
  active: boolean;
  slowMode: boolean;
  accentColor?: string;
  energy?: number;
  showTree?: boolean;
  treeSideMode?: boolean;
}

const CinematicScene: React.FC<CinematicSceneProps> = ({ active, slowMode, accentColor = '#fbbf24', energy = 0.4, showTree = false, treeSideMode = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const treeXPose = useRef(0.5);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.current.y = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let snow: Particle[] = [];
    let magic: Particle[] = [];
    let stars: Star[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    class Star {
      x: number; y: number; size: number; opacity: number; phase: number; 
      speed: number; z: number;
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 8 + 2;
        this.size = Math.random() * 1.2 + 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = 0.0005 + Math.random() * 0.002;
      }
      draw(c: CanvasRenderingContext2D, t: number) {
        const twinkle = Math.sin(t * this.speed + this.phase);
        const px = this.x + mouse.current.x * (10 / this.z);
        const py = this.y + mouse.current.y * (10 / this.z);
        c.beginPath();
        c.arc(px, py, this.size * (1 + twinkle * 0.3), 0, Math.PI * 2);
        c.fillStyle = `rgba(255, 255, 255, ${this.opacity * (0.5 + twinkle * 0.5)})`;
        c.fill();
      }
    }

    class Particle {
      x: number; y: number; z: number; vx: number; vy: number; size: number;
      constructor(isMagic = false) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 6 + 1;
        this.size = (isMagic ? 3 : 1.5) / (this.z * 0.5);
        this.vx = (Math.random() - 0.5) * (0.1 + energy);
        this.vy = (Math.random() * 0.4 + 0.2) / this.z;
      }
      update(slow: boolean) {
        const factor = slow ? 0.08 : 1;
        this.y += this.vy * factor;
        this.x += (this.vx + Math.sin(Date.now() / 3000) * 0.05) * factor;
        if (this.y > canvas.height) this.y = -10;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
      }
      draw(c: CanvasRenderingContext2D, color: string) {
        const px = this.x + mouse.current.x * (30 / this.z);
        const py = this.y + mouse.current.y * (30 / this.z);
        c.beginPath();
        c.arc(px, py, this.size, 0, Math.PI * 2);
        c.fillStyle = color;
        c.fill();
      }
    }

    const drawTree = (t: number) => {
      if (!showTree) return;
      const targetX = treeSideMode ? 0.18 : 0.5;
      treeXPose.current += (targetX - treeXPose.current) * 0.02;

      ctx.save();
      const centerX = canvas.width * treeXPose.current;
      const baseY = canvas.height * 0.88;
      const height = canvas.height * 0.55;
      
      // Halo doux derrière le sapin
      const glow = ctx.createRadialGradient(centerX, baseY - height/2, 0, centerX, baseY - height/2, height * 0.8);
      glow.addColorStop(0, `${accentColor}11`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Structure stylisée du sapin
      for (let i = 0; i < 30; i++) {
        const progress = i / 30;
        const y = baseY - (height * progress);
        const maxWidth = (height - (baseY - y)) * 0.35;
        const sway = Math.sin(t * 0.0008 + i * 0.4) * 4;
        
        ctx.beginPath();
        ctx.moveTo(centerX - maxWidth + sway, y);
        ctx.quadraticCurveTo(centerX + sway, y - 8, centerX + maxWidth + sway, y);
        ctx.shadowBlur = 12;
        ctx.shadowColor = i % 2 === 0 ? accentColor : '#fff';
        ctx.strokeStyle = i % 2 === 0 ? `${accentColor}88` : '#ffffff22';
        ctx.lineWidth = 1;
        ctx.stroke();

        if (i % 5 === 0) {
          const ballX = centerX + (Math.random() > 0.5 ? maxWidth : -maxWidth) * 0.8 + sway;
          ctx.beginPath();
          ctx.arc(ballX, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = i % 10 === 0 ? '#ef4444' : accentColor;
          ctx.fill();
        }
      }

      // Étoile au sommet
      const starY = baseY - height - 15;
      ctx.save();
      ctx.translate(centerX, starY);
      ctx.rotate(t * 0.0005);
      ctx.shadowBlur = 40;
      ctx.shadowColor = '#fff';
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.fillRect(-1, -18, 2, 36);
        ctx.fillRect(-18, -1, 36, 2);
      }
      ctx.restore();
      ctx.restore();
    };

    const init = () => {
      stars = Array.from({ length: 300 }, () => new Star());
      snow = Array.from({ length: 200 }, () => new Particle(false));
      magic = Array.from({ length: 60 }, () => new Particle(true));
    };

    const render = (t: number) => {
      ctx.fillStyle = '#010409';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(s => s.draw(ctx, t));
      drawTree(t);
      
      const snowAlpha = active ? '0.25' : '0.1';
      snow.forEach(p => { 
        p.update(slowMode); 
        p.draw(ctx, `rgba(255,255,255,${snowAlpha})`); 
      });

      if (slowMode) {
        magic.forEach(p => { 
          p.update(true); 
          p.draw(ctx, `${accentColor}66`); 
        });
      }
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render(0);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, slowMode, accentColor, energy, showTree, treeSideMode]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black pointer-events-none" />;
};

export default CinematicScene;
