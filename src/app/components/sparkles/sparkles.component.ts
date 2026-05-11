import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

@Component({
  selector: 'app-sparkles',
  standalone: true,
  template: `<canvas #canvas class="sparkles-canvas"></canvas>`,
  styles: [`
    .sparkles-canvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      width: 100%;
      height: 100%;
      mix-blend-mode: screen;
    }
  `]
})
export class SparklesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private rafId = 0;
  private resizeHandler = () => this.init();

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.init();
    window.addEventListener('resize', this.resizeHandler);
    this.zone.runOutsideAngular(() => this.loop());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.resizeHandler);
  }

  private init(): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.floor((window.innerWidth * window.innerHeight) / 18000);
    this.stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 0.6 + Math.random() * 1.6,
      opacity: 0.4 + Math.random() * 0.5,
      twinkleSpeed: 0.005 + Math.random() * 0.02,
      twinklePhase: Math.random() * Math.PI * 2
    }));
  }

  private loop = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.ctx.clearRect(0, 0, w, h);

    for (const s of this.stars) {
      s.twinklePhase += s.twinkleSpeed;
      const tw = (Math.sin(s.twinklePhase) + 1) / 2;
      const opacity = s.opacity * (0.4 + tw * 0.6);

      this.ctx.save();
      this.ctx.translate(s.x, s.y);
      this.ctx.fillStyle = `rgba(255, 220, 200, ${opacity})`;
      this.ctx.shadowColor = 'rgba(255, 200, 220, 0.8)';
      this.ctx.shadowBlur = 8 * tw;

      const r = s.size * (0.7 + tw * 0.6);
      this.ctx.beginPath();
      this.ctx.moveTo(0, -r * 2);
      this.ctx.lineTo(r * 0.4, -r * 0.4);
      this.ctx.lineTo(r * 2, 0);
      this.ctx.lineTo(r * 0.4, r * 0.4);
      this.ctx.lineTo(0, r * 2);
      this.ctx.lineTo(-r * 0.4, r * 0.4);
      this.ctx.lineTo(-r * 2, 0);
      this.ctx.lineTo(-r * 0.4, -r * 0.4);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    }

    this.rafId = requestAnimationFrame(this.loop);
  };
}
