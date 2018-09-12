import { TestBed, inject } from '@angular/core/testing';

import { SpotifyAudioService } from './spotify-audio.service';

describe('SpotifyAudioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpotifyAudioService]
    });
  });

  it('should be created', inject([SpotifyAudioService], (service: SpotifyAudioService) => {
    expect(service).toBeTruthy();
  }));

  it('should pause audio', inject([SpotifyAudioService], (service: SpotifyAudioService) => {
    service.pauseTrack();
    service.audio = new Audio();
    expect(service.audio.paused).toBe(true);
  }));

  it('should play track audio', inject([SpotifyAudioService], (service: SpotifyAudioService) => {
    service.playAudioTrack('https://p.scdn.co/mp3-preview/ff29ded2c1aa87ed04cb15ea9b1819dc4db95ad7?cid=36895a1dc565456cab5f67f17227a4af');
    expect(service.audio.paused).toBe(false);
    service.audio.pause();
  }));

  it('should set trackUrl to null', inject([SpotifyAudioService], (service: SpotifyAudioService) => {
    service.trackUrl = 'https://p.scdn.co/mp3-preview/ff29ded2c1aa87ed04cb15ea9b1819dc4db95ad7?cid=36895a1dc565456cab5f67f17227a4af';
    service.playAudioTrack('https://p.scdn.co/mp3-preview/ff29ded2c1aa87ed04cb15ea9b1819dc4db95ad7?cid=36895a1dc565456cab5f67f17227a4af');
    expect(service.trackUrl).toBeNull();
  }));

  it('should call pauseTrack()', inject([SpotifyAudioService], (service: SpotifyAudioService) => {
    service.audio = new Audio('https://p.scdn.co/mp3-preview/ff29ded2c1aa87ed04cb15ea9b1819dc4db95ad7?cid=36895a1dc565456cab5f67f17227a4af');
    let serviceSpy = spyOn(service, 'pauseTrack').and.callThrough();
    service.pauseTrack();
    expect(service.pauseTrack).toHaveBeenCalled();
  }));

  it('should set destroy audio object', inject([SpotifyAudioService], (service: SpotifyAudioService) => {
    service.audio = new Audio('https://p.scdn.co/mp3-preview/ff29ded2c1aa87ed04cb15ea9b1819dc4db95ad7?cid=36895a1dc565456cab5f67f17227a4af');
    service.destroy();
    expect(service.trackUrl).toBe(undefined);
  }));

});
