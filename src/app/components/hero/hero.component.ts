import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent {
  @Output() begin = new EventEmitter<void>();

  balloons = Array.from({ length: 9 }, (_, i) => ({
    delay: i * 0.6,
    duration: 11 + (i % 4) * 2,
    left: 5 + i * 11,
    color: ['#e63956', '#ff8fa3', '#d8923a', '#b71f3b', '#f0c480'][i % 5],
  }));

  hearts = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 0.5,
    duration: 8 + (i % 5),
    left: Math.random() * 100,
    size: 12 + Math.random() * 18,
  }));

  name: string = 'Sweetest Soul';

  onBegin(): void {
    this.begin.emit();
  }
}
