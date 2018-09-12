import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SpotifyApiService {
  client_id = '780a86aafb444d96aef50b9be3eee94f';
  client_secret = 'a15377f816384271ab977c776fcd4839';

  private accessToken: any;
  private tokenType: string;
  tempAccessToken: string;
  private preparedSpotifyURIs: any;
  private playlistInfo: any = {
    "name": "Moodify Playlist",
    "description": "This is your Moodify playlist",
    "public": true
  };

  fullURL: string;
  tokenStartPos: number;
  tokenEndPos: number;
  userID: string;
  playlistID: string;
  playlist: any = {};
  previewCounter: number = 0;

  constructor(private http: Http) {}

  // Makes a GET request to the Spotify API to retrieve track information
  // using the track's ID as input
  getPreviewTrack(trackID: string) {
    this.parseToken();
    const options = this.getOptions();
    return this.http.get(`https://api.spotify.com/v1/tracks/` + trackID, options)
                    .map(res => res.json());
  }

  setFullUrl(full: string) {
    this.fullURL = full;
  }

  // Subtracts the temporary access token return by Spotify in the URL
  parseToken() {
    this.tokenStartPos = this.fullURL.indexOf("access_token%3D") + 15;
    this.tokenEndPos = this.fullURL.indexOf("%", this.tokenStartPos);
    this.tempAccessToken = this.fullURL.substring(this.tokenStartPos,
                                                  this.tokenEndPos);
  }

  // Makes consecutive GET and POST requests to Spotify API to retrieve user's id,
  // then create and populate the generated playlist in the user's Spotify account
  createPlaylist(spotifyIDs: any) {
    const getOptions = this.getOptions();
    this.http.get(`https://api.spotify.com/v1/me`, getOptions)
            .map(res => res.json())
            .subscribe(res => {
                this.userID = res.id;
                const postOptions = this.postOptions();
                this.http.post(`https://api.spotify.com/v1/users/` + this.userID + `/playlists`,
                                JSON.stringify(this.playlistInfo), postOptions)
                         .map(res => res.json())
                         .subscribe(res => {
                             this.playlistID = res.id;
                             this.preparedSpotifyURIs = this.prepareSpotifyURIs(spotifyIDs);
                             this.populatePlaylist();
                  });
             });
  }

  // Makes POST request that populates the playlist in the user's Spotify account
  populatePlaylist() {
    const postOptions = this.postOptions();
    this.http.post(`https://api.spotify.com/v1/users/` + this.userID + `/playlists/` + this.playlistID + `/tracks`,
                    JSON.stringify(this.preparedSpotifyURIs), postOptions)
             .map(res => res.json())
             .subscribe(res => { this.getPlaylist(); });
  }

  // Takes in the list of adjectives retrieved from the back-ended and turns
  // in a form appropriate for Spotify's request to add tracks in a playlist
  prepareSpotifyURIs(spotifyIDs: any) {
    let result: any = { "uris": [] };
    for (let i = 0; i < spotifyIDs.spotify_ids.length; i++) {
      result.uris[i] = "spotify:track:" + spotifyIDs.spotify_ids[i];
    }
    return result;
  }

  // Creates a Spotify playlist of the user-generated tracks in their account
  getPlaylist() {
    const options = this.getOptions();
    this.http.get(
          `https://api.spotify.com/v1/users/` + this.userID + `/playlists/` + this.playlistID + `/tracks`,
           options)
      .map(res => res.json())
      .subscribe(res => { this.playlist = res; });
  }

  // Returns a RequestOptions object with GET request options
  getOptions() {
    let header = new Headers();
    header.append('Authorization', 'Bearer ' + this.tempAccessToken);
    let options = new RequestOptions({ headers: header });

    return options;
  }

  // Returns a RequestOptions object with POST request options
  postOptions() {
    let header = new Headers();
    header.append('Authorization', 'Bearer ' + this.tempAccessToken);
    header.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: header });

    return options;
  }

}
