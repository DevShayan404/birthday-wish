import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Memory {
  year: string;
  title: string;
  caption: string;
  emoji: string;
  gradient: string;
}

@Component({
  selector: 'app-memories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memories.component.html',
  styleUrls: ['./memories.component.scss']
})
export class MemoriesComponent {
  memories = signal<Memory[]>([
    {
      year: 'Chapter One',
      title: 'The day we met',
      caption: 'The first time we met, time itself seemed to pause.',
      emoji: '✨',
      gradient: 'linear-gradient(135deg, #e63956 0%, #571425 100%)'
    },
    {
      year: 'Chapter Two',
      title: 'Your laughter',
      caption: 'Your laughter still echoes in my heart, my favorite sound.',
      emoji: '🌹',
      gradient: 'linear-gradient(135deg, #b71f3b 0%, #d8923a 100%)'
    },
    {
      year: 'Chapter Three',
      title: 'Our endless walks',
      caption: 'Hand in hand, talking for hours, wishing the road never ends.',
      emoji: '🌙',
      gradient: 'linear-gradient(135deg, #7f2238 0%, #2a0a12 100%)'
    },
    {
      year: 'Chapter Four',
      title: 'Your smile',
      caption: 'My favorite thing in this world, the light of every morning.',
      emoji: '💗',
      gradient: 'linear-gradient(135deg, #ff8fa3 0%, #e63956 100%)'
    },
    {
      year: 'Chapter Five',
      title: 'Forever ahead',
      caption: 'Our journey has only begun, and I want to walk it with you forever.',
      emoji: '♾️',
      gradient: 'linear-gradient(135deg, #f0c480 0%, #b71f3b 100%)'
    }
  ]);

  current = signal(0);

  next(): void {
    this.current.set((this.current() + 1) % this.memories().length);
  }

  prev(): void {
    const len = this.memories().length;
    this.current.set((this.current() - 1 + len) % len);
  }

  goTo(i: number): void {
    this.current.set(i);
  }

  private touchStartX = 0;

  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
  }

  onTouchEnd(e: TouchEvent): void {
    const dx = e.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(dx) > 50) {
      dx > 0 ? this.prev() : this.next();
    }
  }
}
