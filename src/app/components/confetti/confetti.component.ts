import { Component, ElementRef, Input, NgZone, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  shape: 'rect' | 'circle' | 'heart';
  life: number;
}

@Component({
  selector: 'app-confetti',
  standalone: true,
  template: `<canvas #canvas class="confetti-canvas"></canvas>`,
  styles: [`
    .confetti-canvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 100;
      width: 100%;
      height: 100%;
    }
  `]
})
export class ConfettiComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() autoBurst = true;

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private rafId = 0;
  private resizeHandler = () => this.resize();
  private colors = ['#e63956', '#ff8fa3', '#d8923a', '#f0c480', '#b71f3b', '#ffd9df', '#a86a2a'];

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', this.resizeHandler);
    if (this.autoBurst) {
      setTimeout(() => this.burst(120), 200);
      setTimeout(() => this.burst(80), 1200);
    }
    this.zone.runOutsideAngular(() => this.loop());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.resizeHandler);
  }

  burst(count = 80, originX?: number, originY?: number): void {
    const canvas = this.canvasRef.nativeElement;
    const ox = originX ?? canvas.width / 2;
    const oy = originY ?? canvas.height / 3;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 6 + Math.random() * 8,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        shape: ['rect', 'circle', 'heart'][Math.floor(Math.random() * 3)] as Particle['shape'],
        life: 1
      });
    }
  }

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    this.ctx.scale(dpr, dpr);
  }

  private loop = (): void => {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    this.ctx.clearRect(0, 0, w, h);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vy += 0.18;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.life -= 0.005;

      if (p.y > h + 40 || p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.drawHeart(p.size);
      }
      this.ctx.restore();
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  private drawHeart(size: number): void {
    const s = size / 12;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 3 * s);
    this.ctx.bezierCurveTo(0, 0, -5 * s, 0, -5 * s, -3 * s);
    this.ctx.bezierCurveTo(-5 * s, -6 * s, 0, -6 * s, 0, -2 * s);
    this.ctx.bezierCurveTo(0, -6 * s, 5 * s, -6 * s, 5 * s, -3 * s);
    this.ctx.bezierCurveTo(5 * s, 0, 0, 0, 0, 3 * s);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
