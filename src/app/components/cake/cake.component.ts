import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Candle {
  lit: boolean;
  hue: number;
}

@Component({
  selector: 'app-cake',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cake.component.html',
  styleUrls: ['./cake.component.scss']
})
export class CakeComponent {
  @Output() allBlown = new EventEmitter<void>();

  candles = signal<Candle[]>(
    Array.from({ length: 5 }, (_, i) => ({ lit: true, hue: 340 + (i * 8 - 8) }))
  );

  litCount = signal(5);
  wishMade = signal(false);

  blowCandle(index: number): void {
    const list = [...this.candles()];
    if (!list[index].lit) return;
    list[index] = { ...list[index], lit: false };
    this.candles.set(list);
    const remaining = list.filter(c => c.lit).length;
    this.litCount.set(remaining);
    if (remaining === 0 && !this.wishMade()) {
      this.wishMade.set(true);
      this.allBlown.emit();
    }
  }

  relight(): void {
    this.candles.set(this.candles().map(c => ({ ...c, lit: true })));
    this.litCount.set(5);
    this.wishMade.set(false);
  }
}
