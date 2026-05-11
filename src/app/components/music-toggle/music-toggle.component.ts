import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

@Component({
  selector: 'app-music-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #yt class="yt-host" aria-hidden="true"></div>

    <button
      class="music-toggle"
      (click)="toggle()"
      [class.playing]="playing()"
      [class.waiting]="waiting()"
      [disabled]="!ready()"
      [attr.aria-label]="playing() ? 'Pause music' : 'Play music'"
    >
      <span class="bars" *ngIf="playing()">
        <span></span><span></span><span></span><span></span>
      </span>
      <svg *ngIf="!playing()" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    </button>

    <div class="music-hint" *ngIf="waiting()" role="status">
      <span class="dot">🎻</span>
      <span>Tap anywhere to play music</span>
    </div>
  `,
  styleUrls: ['./music-toggle.component.scss']
})
export class MusicToggleComponent implements AfterViewInit, OnDestroy {
  @ViewChild('yt', { static: true }) hostRef!: ElementRef<HTMLDivElement>;

  private readonly videoId = 'XyEks13fGFs';
  private readonly volume = 55;

  playing = signal(false);
  waiting = signal(false);
  ready = signal(false);

  private player: any;
  private autoplayCleanup?: () => void;
  private apiReadyHandler?: () => void;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.loadApiAndCreatePlayer();
  }

  ngOnDestroy(): void {
    try { this.player?.destroy?.(); } catch {}
    this.autoplayCleanup?.();
    if (this.apiReadyHandler && window.onYouTubeIframeAPIReady === this.apiReadyHandler) {
      window.onYouTubeIframeAPIReady = undefined;
    }
  }

  toggle(): void {
    if (!this.ready() || !this.player) return;
    if (this.playing()) {
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
  }

  private loadApiAndCreatePlayer(): void {
    if (window.YT && window.YT.Player) {
      this.createPlayer();
      return;
    }

    const existing = document.querySelector('script[data-yt-api]');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.setAttribute('data-yt-api', 'true');
      document.head.appendChild(script);
    }

    this.apiReadyHandler = () => this.zone.run(() => this.createPlayer());
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      this.apiReadyHandler?.();
    };
  }

  private createPlayer(): void {
    if (!window.YT?.Player) return;

    const mount = document.createElement('div');
    mount.id = `yt-player-${Math.random().toString(36).slice(2, 8)}`;
    this.hostRef.nativeElement.appendChild(mount);

    this.player = new window.YT.Player(mount.id, {
      videoId: this.videoId,
      width: '1',
      height: '1',
      playerVars: {
        autoplay: 1,
        loop: 1,
        playlist: this.videoId,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        iv_load_policy: 3
      },
      events: {
        onReady: (e: any) => this.zone.run(() => this.onReady(e)),
        onStateChange: (e: any) => this.zone.run(() => this.onStateChange(e))
      }
    });
  }

  private onReady(e: any): void {
    this.ready.set(true);
    try { e.target.setVolume(this.volume); } catch {}
    try {
      e.target.playVideo();
    } catch {}
    setTimeout(() => {
      const state = this.player?.getPlayerState?.();
      if (state !== 1) this.armOnFirstGesture();
    }, 400);
  }

  private onStateChange(e: any): void {
    const PLAYING = 1, PAUSED = 2, ENDED = 0, BUFFERING = 3;
    if (e.data === PLAYING) {
      this.playing.set(true);
      this.waiting.set(false);
    } else if (e.data === PAUSED) {
      this.playing.set(false);
    } else if (e.data === ENDED) {
      try { this.player.playVideo(); } catch {}
    }
  }

  private armOnFirstGesture(): void {
    if (this.autoplayCleanup) return;
    this.waiting.set(true);
    const start = () => {
      this.autoplayCleanup?.();
      try { this.player?.playVideo(); } catch {}
    };
    const events: (keyof DocumentEventMap)[] = [
      'pointerdown', 'pointerup', 'touchstart', 'touchend',
      'keydown', 'click', 'scroll', 'wheel', 'mousemove'
    ];
    const opts: AddEventListenerOptions = { once: true, passive: true };
    events.forEach(e => document.addEventListener(e, start, opts));
    this.autoplayCleanup = () => {
      events.forEach(e => document.removeEventListener(e, start));
      this.autoplayCleanup = undefined;
    };
  }
}
