import { Component, HostListener, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxService } from '../../shared/lightbox.service';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent {
  svc = inject(LightboxService);

  isOpen = computed(() => this.svc.index() !== null);
  current = computed(() => {
    const i = this.svc.index();
    return i === null ? null : this.svc.photos()[i] ?? null;
  });

  close(event?: Event): void {
    event?.stopPropagation();
    this.svc.close();
  }

  next(event?: Event): void {
    event?.stopPropagation();
    this.svc.next();
  }

  prev(event?: Event): void {
    event?.stopPropagation();
    this.svc.prev();
  }

  stop(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (!this.isOpen()) return;
    if (e.key === 'Escape') this.close();
    else if (e.key === 'ArrowRight') this.next();
    else if (e.key === 'ArrowLeft') this.prev();
  }
}
