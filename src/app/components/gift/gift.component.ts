import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gift',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.scss']
})
export class GiftComponent {
  @Output() opened = new EventEmitter<void>();

  isOpen = signal(false);

  open(): void {
    if (this.isOpen()) return;
    this.isOpen.set(true);
    this.opened.emit();
  }
}
