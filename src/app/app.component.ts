import {
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { CakeComponent } from './components/cake/cake.component';
import { MemoriesComponent } from './components/memories/memories.component';
import { LetterComponent } from './components/letter/letter.component';
import { GiftComponent } from './components/gift/gift.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ConfettiComponent } from './components/confetti/confetti.component';
import { SparklesComponent } from './components/sparkles/sparkles.component';
import { SectionNavComponent } from './components/section-nav/section-nav.component';
import { MusicToggleComponent } from './components/music-toggle/music-toggle.component';
import { LightboxComponent } from './components/lightbox/lightbox.component';
import { CountdownComponent } from './components/countdown/countdown.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    CakeComponent,
    MemoriesComponent,
    LetterComponent,
    GiftComponent,
    GalleryComponent,
    ConfettiComponent,
    SparklesComponent,
    SectionNavComponent,
    MusicToggleComponent,
    LightboxComponent,
    CountdownComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild(ConfettiComponent) confetti?: ConfettiComponent;

  /** True once May 20 has arrived; gates the main experience. */
  unlocked = signal(this.isBirthdayOrLater());

  private rafId = 0;

  constructor(private zone: NgZone) {}

  private isBirthdayOrLater(): boolean {
    const now = new Date();
    const target = new Date(now.getFullYear(), 4, 20, 0, 0, 0, 0);
    return now.getTime() >= target.getTime();
  }

  onCountdownComplete(): void {
    this.unlocked.set(true);
    requestAnimationFrame(() => this.updateStack());
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScrollListener, {
        passive: true,
      });
      window.addEventListener('resize', this.onResizeListener);
    });
    requestAnimationFrame(() => this.updateStack());
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScrollListener);
    window.removeEventListener('resize', this.onResizeListener);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  scrollTo(id: string): void {
    const inner = document.getElementById(id);
    if (!inner) return;
    const item = inner.closest<HTMLElement>('.stack-item');
    if (!item) {
      inner.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const top = item.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  onCakeBlown(): void {
    this.confetti?.burst(160, window.innerWidth / 2, window.innerHeight / 2);
    setTimeout(
      () =>
        this.confetti?.burst(
          120,
          window.innerWidth * 0.3,
          window.innerHeight / 2,
        ),
      300,
    );
    setTimeout(
      () =>
        this.confetti?.burst(
          120,
          window.innerWidth * 0.7,
          window.innerHeight / 2,
        ),
      600,
    );
  }

  onGiftOpened(): void {
    this.confetti?.burst(220, window.innerWidth / 2, window.innerHeight / 2);
    setTimeout(() => this.confetti?.burst(150), 400);
    setTimeout(() => this.confetti?.burst(150), 900);
  }

  private onScrollListener = (): void => {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = 0;
      this.updateStack();
    });
  };

  private onResizeListener = (): void => this.updateStack();

  private updateStack(): void {
    const items = document.querySelectorAll<HTMLElement>('.stack-item');
    const winH = window.innerHeight;
    items.forEach((item, i) => {
      const content = item.querySelector<HTMLElement>('.stack-content');
      if (!content) return;
      const next = items[i + 1];
      if (!next) {
        content.style.transform = '';
        content.style.opacity = '';
        content.style.filter = '';
        return;
      }
      const nextRect = next.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (winH - nextRect.top) / winH));
      if (progress > 0) {
        const scale = 1 - progress * 0.07;
        const ty = -progress * 28;
        const opacity = 1 - progress * 0.5;
        content.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        content.style.opacity = opacity.toFixed(3);
        content.style.filter = '';
      } else {
        content.style.transform = '';
        content.style.opacity = '';
        content.style.filter = '';
      }
    });
  }
}
