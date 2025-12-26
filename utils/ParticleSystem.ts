import { EmotionalTheme } from '../themes';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  swing?: number;
  swingSpeed?: number;
  rotation?: number;
  rotationSpeed?: number;
  color?: string;
  pulse?: number;
  pulseSpeed?: number;
}

export class WinterParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private theme: EmotionalTheme;

  constructor(canvas: HTMLCanvasElement, theme: EmotionalTheme) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.theme = theme;
    this.init();
  }

  private init() {
    this.particles = [];
    const particleCount = this.getParticleCount();
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private getParticleCount(): number {
    const baseCount = 200;
    // Ajuster selon le thème
    switch (this.theme.particles) {
      case 'hearts': return baseCount * 0.8;
      case 'rose-petals': return baseCount * 0.6;
      case 'sparkles': return baseCount * 1.2;
      default: return baseCount;
    }
  }

  private createSnowflake(): Particle {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.02 + 0.01,
      rotation: 0,
      rotationSpeed: Math.random() * 0.02 - 0.01
    };
  }

  private createHeart(): Particle {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: `rgba(255, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 150}, 0.7)`,
      pulse: 0,
      pulseSpeed: Math.random() * 0.05 + 0.02
    };
  }

  private createRosePetal(): Particle {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 1.5 + 0.8,
      opacity: Math.random() * 0.6 + 0.4,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.03 + 0.01,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: Math.random() * 0.01 - 0.005,
      color: `rgba(${Math.random() * 50 + 200}, ${Math.random() * 30 + 50}, ${Math.random() * 50 + 100}, 0.8)`
    };
  }

  private createSparkle(): Particle {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.9 + 0.1,
      pulse: 0,
      pulseSpeed: Math.random() * 0.1 + 0.05
    };
  }

  private createParticle(): Particle {
    switch (this.theme.particles) {
      case 'hearts': return this.createHeart();
      case 'rose-petals': return this.createRosePetal();
      case 'sparkles': return this.createSparkle();
      default: return this.createSnowflake();
    }
  }

  update() {
    this.particles.forEach(particle => {
      // Physique différente selon le type
      if (particle.swing !== undefined && particle.swingSpeed !== undefined) {
        particle.x += Math.sin(particle.swing) * 0.5;
        particle.swing += particle.swingSpeed;
      }

      particle.y += particle.speed;

      if (particle.rotation !== undefined && particle.rotationSpeed !== undefined) {
        particle.rotation += particle.rotationSpeed;
      }

      if (particle.pulse !== undefined && particle.pulseSpeed !== undefined) {
        particle.pulse += particle.pulseSpeed;
      }

      // Réapparition en haut
      if (particle.y > this.canvas.height + 20) {
        Object.assign(particle, this.createParticle());
        particle.y = -20;
      }

      // Gestion des bords latéraux
      if (particle.x > this.canvas.width + 20) particle.x = -20;
      if (particle.x < -20) particle.x = this.canvas.width + 20;
    });
  }

  render() {
    this.ctx.save();
    this.particles.forEach(particle => {
      this.ctx.save();

      // Position
      this.ctx.translate(particle.x, particle.y);

      // Rotation
      if (particle.rotation !== undefined) {
        this.ctx.rotate(particle.rotation);
      }

      // Opacité
      this.ctx.globalAlpha = particle.opacity;

      // Pulsation
      let currentSize = particle.size;
      if (particle.pulse !== undefined) {
        currentSize *= 1 + Math.sin(particle.pulse) * 0.3;
      }

      switch (this.theme.particles) {
        case 'hearts':
          this.drawHeart(currentSize, particle.color || '#ff69b4');
          break;
        case 'rose-petals':
          this.drawRosePetal(currentSize, particle.color || '#dc143c');
          break;
        case 'sparkles':
          this.drawSparkle(currentSize);
          break;
        default:
          this.drawSnowflake(currentSize);
      }

      this.ctx.restore();
    });
    this.ctx.restore();
  }

  private drawSnowflake(size: number) {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();

    // Dessiner une forme de flocon simple
    for (let i = 0; i < 6; i++) {
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0, -size);
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(size * 0.3, -size * 0.7);
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(-size * 0.3, -size * 0.7);
      this.ctx.rotate(Math.PI / 3);
    }
    this.ctx.stroke();
  }

  private drawHeart(size: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, size * 0.3);
    this.ctx.bezierCurveTo(-size * 0.3, -size * 0.2, -size, size * 0.2, 0, size);
    this.ctx.bezierCurveTo(size, size * 0.2, size * 0.3, -size * 0.2, 0, size * 0.3);
    this.ctx.fill();
  }

  private drawRosePetal(size: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, size * 0.5, size, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawSparkle(size: number) {
    this.ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
    this.ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
    this.ctx.shadowBlur = size * 2;

    // Étoile à 4 branches
    this.ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0, -size);
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(size * 0.7, -size * 0.7);
      this.ctx.rotate(Math.PI / 2);
    }
    this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.9)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.shadowBlur = 0;
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.init();
  }
}