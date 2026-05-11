import {
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxService } from '../../shared/lightbox.service';

export interface Photo {
  src?: string;
  caption: string;
  date: string;
  emoji: string;
  gradient: string;
  rotate: number;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
  // Drop real photos in src/assets/photos/ and set the `src` field below.
  // Leave src empty to use the gradient placeholder.
  photos = signal<Photo[]>([
    {
      caption: 'Golden hour selfie',
      date: 'Cozy Evening',
      emoji: '✨',
      gradient: 'linear-gradient(135deg, #e63956, #571425)',
      rotate: -3,
      src: 'assets/photos/bf2bc729-1d55-48ca-9942-a211154571a7.JPG',
    },
    {
      caption: 'Eyes full of love',
      date: 'Sunny Day',
      emoji: '🌅',
      gradient: 'linear-gradient(135deg, #ff8fa3, #d8923a)',
      rotate: 2,
      src: 'assets/photos/IMG_4194.jpg',
    },
    {
      caption: 'A quiet moment',
      date: 'Together',
      emoji: '😊',
      gradient: 'linear-gradient(135deg, #b71f3b, #e63956)',
      rotate: -2,
      src: 'assets/photos/IMG_2390.jpg',
    },
    {
      caption: 'Gym day memories',
      date: 'Power Couple',
      emoji: '💗',
      gradient: 'linear-gradient(135deg, #ff8fa3, #b71f3b)',
      rotate: 4,
      src: 'assets/photos/IMG_6318.jpg',
    },
    {
      caption: 'Dressed to shine',
      date: 'Special Event',
      emoji: '🌹',
      gradient: 'linear-gradient(135deg, #7f2238, #2a0a12)',
      rotate: -4,
      src: 'assets/photos/IMG_8764.jpg',
    },
    {
      caption: 'Close to my heart',
      date: 'Soft Night',
      emoji: '🌙',
      gradient: 'linear-gradient(135deg, #571425, #b71f3b)',
      rotate: 3,
      src: 'assets/photos/IMG_9502.jpg',
    },
    {
      caption: 'Streets and smiles',
      date: 'City Vibes',
      emoji: '💞',
      gradient: 'linear-gradient(135deg, #f0c480, #b71f3b)',
      rotate: -2,
      src: 'assets/photos/IMG_3120.jpg',
    },
    {
      caption: 'Forever us',
      date: 'Skyline Date',
      emoji: '♾️',
      gradient: 'linear-gradient(135deg, #b71f3b, #7f2238)',
      rotate: 3,
      src: 'assets/photos/IMG_9503.PNG',
    },
  ]);

  private lightbox = inject(LightboxService);

  open(i: number, event?: Event): void {
    event?.stopPropagation();
    this.lightbox.open(this.photos(), i);
  }
}
