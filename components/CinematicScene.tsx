
import React, { useEffect, useRef } from 'react';
import { EmotionalTheme } from '../themes';
import { WinterParticleSystem } from '../utils/ParticleSystem';

interface CinematicSceneProps {
  active: boolean;
  slowMode: boolean;
  theme?: EmotionalTheme;
  energy?: number;
  showTree?: boolean;
  treeSideMode?: boolean;
}

const CinematicScene: React.FC<CinematicSceneProps> = ({ active, slowMode, theme, energy = 0.4, showTree = false, treeSideMode = false }) => {
  const accentColor = theme?.primary || '#fbbf24';
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
    if (!canvas || !theme) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    let particleSystem: WinterParticleSystem;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particleSystem = new WinterParticleSystem(canvas, theme);
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
      glow.addColorStop(0, `${theme.primary}11`);
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
        ctx.shadowColor = i % 2 === 0 ? theme.primary : '#fff';
        ctx.strokeStyle = i % 2 === 0 ? `${theme.primary}88` : '#ffffff22';
        ctx.lineWidth = 1;
        ctx.stroke();

        if (i % 5 === 0) {
          const ballX = centerX + (Math.random() > 0.5 ? maxWidth : -maxWidth) * 0.8 + sway;
          ctx.beginPath();
          ctx.arc(ballX, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = i % 10 === 0 ? '#ef4444' : theme.primary;
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
    };

    const render = (t: number) => {
      ctx.fillStyle = '#010409';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => s.draw(ctx, t));
      drawTree(t);

      // Rendre les particules du système avancé
      if (particleSystem) {
        particleSystem.update();
        particleSystem.render();
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
  }, [active, slowMode, theme, energy, showTree, treeSideMode]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black pointer-events-none" />;
};

export default CinematicScene;
