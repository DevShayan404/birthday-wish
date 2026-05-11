import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-letter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss']
})
export class LetterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('section', { static: true }) sectionRef!: ElementRef<HTMLElement>;

  fullText = `My love,

Today may be just another date for the world, but for me, it is the day someone extraordinary was born. Meeting you gave my life a deeper meaning, and every morning feels brighter because of your smile.

Every moment with you is precious, every word, every laugh, every quiet pause. I wish you endless happiness, and I hope we stay together through every season of life.

Happy Birthday, my life 💕
Forever yours`;

  displayed = signal('');
  started = false;
  private observer?: IntersectionObserver;
  private timer?: number;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !this.started) {
          this.started = true;
          this.startTyping();
          this.observer?.disconnect();
        }
      }
    }, { threshold: 0.35 });
    this.observer.observe(this.sectionRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.timer) clearInterval(this.timer);
  }

  private startTyping(): void {
    let i = 0;
    this.zone.runOutsideAngular(() => {
      this.timer = window.setInterval(() => {
        i++;
        this.zone.run(() => this.displayed.set(this.fullText.slice(0, i)));
        if (i >= this.fullText.length) {
          clearInterval(this.timer);
        }
      }, 35);
    });
  }
}
