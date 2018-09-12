import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { Router } from '@angular/router';
import { SpotifyAudioService } from '../../services/spotify-audio.service';
import { SpotifyApiService } from '../../services/spotify-api.service';
import { WebApiService } from '../../services/web-api.service';
import { PlaylistComponent } from './playlist.component';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { Subscription } from 'rxjs';

describe('PlaylistComponent', () => {
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;

  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    let spotifyAPI = {
      createPlaylist: function(spotifyIDs: any) {
        return true;
      },
      getPreviewTrack: function(trackID: string) {
        return new EmptyObservable();
      }
    };
    let spotifyAudio = {
      playAudioTrack: function(nextTrackUrl) {
        return true;
      }
    };
    let webAPI = {
      getBackendSpotifyIDs: function() {
        return {"spotify_ids": ['spotify:track:1', 'spotify:track:2']};
      }
    };

    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      declarations: [ PlaylistComponent ],
      providers: [ { provide: SpotifyApiService, useValue: spotifyAPI },
                   { provide: SpotifyAudioService, useValue: spotifyAudio },
                   { provide: WebApiService, useValue: webAPI },
                   { provide: Router, useValue: routerSpy },
                   { provide: XHRBackend, useClass: MockBackend }
                 ]
    })
    .compileComponents();

    webAPI = TestBed.get(WebApiService);
    spotifyAPI = TestBed.get(SpotifyApiService);
    spotifyAudio = TestBed.get(SpotifyAudioService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isEmpty() should return true', () => {
    let result = component.isEmpty({});
    expect(result).toBeTruthy();
  });

  it('isEmpty() should return false', () => {
    let result = component.isEmpty({"key":"value"});
    expect(result).toBeFalsy();
  });

  it('getPlaylist() should call createPlaylist()', () => {
    component.previewIDs = {"spotify_ids": ['spotify:track:1', 'spotify:track:2']};
    component.spotifyAPI = fixture.debugElement.injector.get(SpotifyApiService);
    let createPlaylistSpy = spyOn(component.spotifyAPI, 'createPlaylist').and.callThrough();
    component.getPlaylist();
    expect(createPlaylistSpy).toHaveBeenCalled();
  });

  it('playPauseSong() should call playAudioTrack()', () => {
    component.currentTrack.preview_url = "http://test.url";
    component.spotifyAudio = fixture.debugElement.injector.get(SpotifyAudioService);
    let playAudioTrackSpy = spyOn(component.spotifyAudio, 'playAudioTrack').and.callThrough();
    component.playPauseSong();
    expect(playAudioTrackSpy).toHaveBeenCalled();
  });

  it('playPauseSong() should call skipSong()', () => {
    component.currentTrack.preview_url = null;
    component.spotifyAudio = fixture.debugElement.injector.get(SpotifyAudioService);
    let skipSongSpy = spyOn(component, 'skipSong').and.callThrough();
    component.playPauseSong();
    expect(skipSongSpy).toHaveBeenCalled();
  });

  it('should toggle playPauseLabel to pauseLabel', () => {
    component.playPauseLabel = component.pauseLabel;
    component.togglePlayPauseLabel();
    expect(component.playPauseLabel).toEqual(component.playLabel);
  });

  it('should toggle playPauseLabel to playLabel', () => {
    component.playPauseLabel = component.playLabel;
    component.togglePlayPauseLabel();
    expect(component.playPauseLabel).toEqual(component.pauseLabel);
  });

  it('getTrack() should call spotifyAPI.getPreviewTrack()', () => {
    component.webAPI = fixture.debugElement.injector.get(WebApiService);
    component.spotifyAPI = fixture.debugElement.injector.get(SpotifyApiService);
    let getPreviewTrackSpy = spyOn(component.spotifyAPI, 'getPreviewTrack').and.callThrough();
    component.getTrack();
    expect(getPreviewTrackSpy).toHaveBeenCalled();
  });

  it('skipSong() should increment counter and call getTrack()', () => {
    let getTrackSpy = spyOn(component, 'getTrack').and.callThrough();
    component.loaded = true;
    component.skipSong();
    expect(getTrackSpy).toHaveBeenCalled();
    expect(component.counter).toEqual(1);
    expect(component.loaded).toBeFalsy();
  });

  it('getTrack() should call playPauseSong() and togglePlayPauseLabel()', () => {
    let playPauseSongSpy = spyOn(component, 'playPauseSong').and.callThrough();
    let togglePlayPauseLabelSpy = spyOn(component, 'togglePlayPauseLabel').and.callThrough();
    component.loaded = true;
    component.getTrack();
    expect(playPauseSongSpy).toHaveBeenCalled();
    expect(togglePlayPauseLabelSpy).toHaveBeenCalled();
  });

});
