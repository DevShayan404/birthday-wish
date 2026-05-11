import { AfterViewInit, Component, NgZone, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SectionItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-section-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="section-nav" aria-label="Section navigation">
      <ul>
        <li *ngFor="let s of sections; let i = index">
          <button
            type="button"
            (click)="goTo(i)"
            [class.active]="active() === i"
            [attr.aria-label]="s.label"
          >
            <span class="dot"></span>
            <span class="label">{{ s.label }}</span>
          </button>
        </li>
      </ul>
    </nav>
  `,
  styleUrls: ['./section-nav.component.scss']
})
export class SectionNavComponent implements AfterViewInit, OnDestroy {
  sections: SectionItem[] = [
    { id: 'hero', label: 'Welcome' },
    { id: 'cake', label: 'Wish' },
    { id: 'memories', label: 'Memories' },
    { id: 'gallery', label: 'Photos' },
    { id: 'letter', label: 'Letter' },
    { id: 'gift', label: 'Gift' },
    { id: 'footer-end', label: 'Forever' }
  ];

  active = signal(0);
  private rafId = 0;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll);
    });
    setTimeout(() => this.onScroll(), 50);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  /**
   * Compute each section's natural document offset by walking the DOM in order
   * and accumulating offsetHeight. This is reliable even when intermediate
   * elements use position: sticky (offsetTop / getBoundingClientRect can return
   * the painted/sticky-pinned position rather than the natural layout offset).
   */
  private computePositions(): { top: number; height: number }[] {
    const stackItems = Array.from(
      document.querySelectorAll<HTMLElement>('.stack-item')
    );
    const positions: { top: number; height: number }[] = [];

    let cumulative = this.mainOffsetTop();
    for (const item of stackItems) {
      const h = item.offsetHeight;
      positions.push({ top: cumulative, height: h });
      cumulative += h;
    }

    const footer = document.getElementById('footer-end');
    if (footer) {
      positions.push({ top: cumulative, height: footer.offsetHeight });
    }
    return positions;
  }

  private mainOffsetTop(): number {
    const main = document.querySelector<HTMLElement>('main.stack');
    if (!main) return 0;
    let top = 0;
    let cur: HTMLElement | null = main;
    while (cur) {
      top += cur.offsetTop;
      cur = cur.offsetParent as HTMLElement | null;
    }
    return top;
  }

  goTo(i: number): void {
    const positions = this.computePositions();
    if (i < 0 || i >= positions.length) return;
    window.scrollTo({ top: positions[i].top, behavior: 'smooth' });
  }

  private onScroll = (): void => {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = 0;
      const positions = this.computePositions();
      if (!positions.length) return;

      const winH = window.innerHeight;
      const probe = window.scrollY + winH * 0.4;

      let idx = 0;
      for (let i = 0; i < positions.length; i++) {
        if (probe >= positions[i].top) idx = i;
        else break;
      }

      if (idx !== this.active()) {
        this.zone.run(() => this.active.set(idx));
      }
    });
  };
}
