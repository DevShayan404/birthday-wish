import {
  AfterViewInit,
  Component,
  EventEmitter,
  NgZone,
  OnDestroy,
  Output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements AfterViewInit, OnDestroy {
  @Output() complete = new EventEmitter<void>();

  /** Target birthday: May 20 (month index 4). Year auto-rolls to next if past. */
  private static readonly BIRTHDAY_MONTH = 4;
  private static readonly BIRTHDAY_DAY = 20;

  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);
  ready = signal(false);

  petals = Array.from({ length: 14 }, (_, i) => ({
    delay: i * 0.45,
    duration: 9 + (i % 5),
    left: (i * 7.1 + (i % 2 ? 3 : -2)) % 100,
    size: 14 + (i % 4) * 6
  }));

  private targetDate: Date;
  private intervalId?: number;

  constructor(private zone: NgZone) {
    this.targetDate = this.computeTargetDate();
  }

  ngAfterViewInit(): void {
    this.tick();
    this.ready.set(true);
    this.zone.runOutsideAngular(() => {
      this.intervalId = window.setInterval(() => {
        this.zone.run(() => this.tick());
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  private computeTargetDate(): Date {
    const now = new Date();
    let year = now.getFullYear();
    let target = new Date(year, CountdownComponent.BIRTHDAY_MONTH, CountdownComponent.BIRTHDAY_DAY, 0, 0, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target = new Date(year + 1, CountdownComponent.BIRTHDAY_MONTH, CountdownComponent.BIRTHDAY_DAY, 0, 0, 0, 0);
    }
    return target;
  }

  private tick(): void {
    const diff = this.targetDate.getTime() - Date.now();
    if (diff <= 0) {
      this.days.set(0);
      this.hours.set(0);
      this.minutes.set(0);
      this.seconds.set(0);
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
      }
      this.complete.emit();
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    this.days.set(days);
    this.hours.set(hours);
    this.minutes.set(minutes);
    this.seconds.set(seconds);
  }
}
