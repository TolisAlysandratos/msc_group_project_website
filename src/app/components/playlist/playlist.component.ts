import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SpotifyAudioService } from '../../services/spotify-audio.service';
import { SpotifyApiService } from '../../services/spotify-api.service';
import { WebApiService } from '../../services/web-api.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent {

  playlistSaved: boolean = false;
  counter: number = 0;
  loaded: boolean = false;
  playlist: any = {};
  previewIDs: any = {};
  currentTrack: any = {};
  playLabel: string = String.fromCharCode(9658);
  pauseLabel: string = String.fromCharCode(10074) + String.fromCharCode(10074);
  skipLabel: string = String.fromCharCode(187);
  playPauseLabel: string = this.playLabel;
  endOfTrack: boolean = false;

  constructor(
    public spotifyAudio: SpotifyAudioService,
    public spotifyAPI: SpotifyApiService,
    public webAPI: WebApiService,
    private router: Router
  ) {
    // Listens to event from SpotifyAudioService when a track's playback ends
    spotifyAudio.trackEndedEvent.subscribe(
      () => {
        this.togglePlayPauseLabel();
      });
  }

  // Generates playlist for user from the button click
  savePlaylistAndRedirectToEnd() {
    this.getPlaylist();
    this.playlistSaved = true;
  }

  // Creates/adds the generated playlist to the user's Spotify account
  getPlaylist() {
    this.spotifyAPI.createPlaylist(this.previewIDs);
  }

  // Checks if a Typescript object is empty
  isEmpty(obj: any) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) { return false; }
    }
    return true;
  }

  // Handles the play/pause behaviour of the preview Player
  // Retrieves and plays/pauses track previews using their Spotify IDs
  getTrack() {
    if (!this.loaded) {
      this.previewIDs = this.webAPI.getBackendSpotifyIDs();

      // Redirects to the start page if session token has expired
      if (this.isEmpty(this.previewIDs)) {
        window.location.href = `https://accounts.spotify.com/authorize?client_id=780a86aafb444d96aef50b9be3eee94f&scope=playlist-modify-public&response_type=token&redirect_uri=https:%2F%2Fmoodifyplay.azurewebsites.net`;
        return;
      }
      this.spotifyAPI.getPreviewTrack(this.previewIDs.spotify_ids[this.counter])
                     .subscribe(track => {
                         this.currentTrack = track;
                         this.loaded = true;
                         this.playPauseSong();
                         if (this.playPauseLabel === this.playLabel) {
                            this.togglePlayPauseLabel();
                         };
                      });

    }
    else {
      this.playPauseSong();
      this.togglePlayPauseLabel();
    }


  }

  // Play/pause the current track
  playPauseSong() {
    if (this.currentTrack.preview_url === null) {
      this.skipSong();
    }
    else {
      this.spotifyAudio.playAudioTrack(this.currentTrack.preview_url);
    }
  }

  // Toggles between the play and pause labels on the player's button
  togglePlayPauseLabel() {
    if (this.playPauseLabel == this.playLabel) {
      this.playPauseLabel = this.pauseLabel;
    }
    else {
      this.playPauseLabel = this.playLabel;
    }
  }

  // Skips and plays the next song
  skipSong() {
    if (this.loaded) {
      this.counter++;
      this.loaded = false;
      this.getTrack();
    }
  }

  ngOnDestroy() {
    this.spotifyAudio.destroy();
  }

}
