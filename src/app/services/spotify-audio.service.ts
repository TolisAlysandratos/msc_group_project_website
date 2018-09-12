import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';

@Injectable()
export class SpotifyAudioService {

  constructor() { }

  // Audio Object
  audio: HTMLAudioElement;

  // Player status (true if playing, false if not)
  ended$: Subject<boolean> = new BehaviorSubject<boolean>(null);

  // Current track Url
  trackUrl: string;
  trackEndedEvent: EventEmitter<any> = new EventEmitter();

  // Play a Spotify track
  playAudioTrack(nextTrackUrl) {

    // Stop current track
    this.pauseTrack();

    // Do nothing, if next and current track are the same
    if (nextTrackUrl === this.trackUrl) {
      this.trackUrl = null;
      return;
    }

    // Play track
    this.trackUrl = nextTrackUrl;
    this.audio = new Audio(nextTrackUrl);
    this.audio.crossOrigin = 'anonymous';
    this.audio.play();
    this.audio.addEventListener('ended', () => {
      this.trackUrl = null;
      this.ended$.next(true);
      this.trackEndedEvent.emit();
    });
  }

  // Pause Spotify Track
  pauseTrack() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  // Destroy audio object
  destroy() {
    if (this.audio) {
      this.audio.pause();
      delete this.audio;
    }
  }

}
