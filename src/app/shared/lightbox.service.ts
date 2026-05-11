import { Injectable, signal } from '@angular/core';
import { Photo } from '../components/gallery/gallery.component';

@Injectable({ providedIn: 'root' })
export class LightboxService {
  photos = signal<Photo[]>([]);
  index = signal<number | null>(null);

  private prevBodyOverflow = '';

  open(photos: Photo[], i: number): void {
    this.photos.set(photos);
    this.index.set(i);
    this.prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.index.set(null);
    document.body.style.overflow = this.prevBodyOverflow;
  }

  next(): void {
    const i = this.index();
    if (i === null) return;
    const len = this.photos().length;
    if (!len) return;
    this.index.set((i + 1) % len);
  }

  prev(): void {
    const i = this.index();
    if (i === null) return;
    const len = this.photos().length;
    if (!len) return;
    this.index.set((i - 1 + len) % len);
  }
}
