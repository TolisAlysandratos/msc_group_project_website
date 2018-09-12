import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { SpotifyApiService } from './spotify-api.service';

///
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('SpotifyApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        SpotifyApiService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });

  it('should return an Observable<Array<IDs>>',
    inject([SpotifyApiService, XHRBackend], (spotifyAPI, mockBackend) => {

      const mockResponse = {
        type: 'track'
      };

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      spotifyAPI.getPreviewTrack('123').subscribe((trackInfo) => {
        expect(trackInfo.type).toEqual('track');
      });

  }));

  it('should set playlist to response',
    inject([SpotifyApiService, XHRBackend], (spotifyAPI, mockBackend) => {

      const mockResponse = {
        type: 'track'
      };

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      spotifyAPI.getPlaylist();
      expect(spotifyAPI.playlist).toEqual(mockResponse);

  }));

  it('should call populatePlaylist()',
    inject([SpotifyApiService, XHRBackend], (spotifyAPI, mockBackend) => {

      const mockResponse = {
        type: 'ok'
      };

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      spotifyAPI.preparedSpotifyURIs = {"uris": ['spotify:track:1', 'spotify:track:2']};
      spotifyAPI.populatePlaylist();
      expect(spotifyAPI.playlist).toEqual(mockResponse);

  }));

  it('should call createPlaylist',
    inject([SpotifyApiService, XHRBackend], (spotifyAPI, mockBackend) => {

      const mockResponse = {
        type: 'ok',
        tracks: ['a','b']
      };

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      const ids = {"spotify_ids": ['spotify:track:1', 'spotify:track:2']};
      spotifyAPI.createPlaylist(ids);
      expect(spotifyAPI.playlist.tracks).toEqual(mockResponse.tracks);

  }));

  let httpClientSpy: { get: jasmine.Spy };
  let spotifyAPI: SpotifyApiService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    spotifyAPI = new SpotifyApiService(<any> httpClientSpy);
  });

  it('should be created', () => {
    expect(spotifyAPI).toBeTruthy();
  });

  it('should create RequestOptions object for POST', () => {
    spotifyAPI.postOptions();
    expect(spotifyAPI).toBeTruthy();
  });

  it('should create RequestOptions object for GET', () => {
    spotifyAPI.getOptions();
    expect(spotifyAPI).toBeTruthy();
  });

  it('should prepare a list of id for Spotify', () => {
    expect(spotifyAPI.prepareSpotifyURIs({"spotify_ids": ['1', '2']}))
    .toEqual({"uris": ['spotify:track:1', 'spotify:track:2']});
  });

  it('should parse access token from url', () => {
    let spotifyAPI = new SpotifyApiService(<any> httpClientSpy);
    spotifyAPI.fullURL = 'http://localhost:4200/emojis#access_token=BQDZXbCZYEo5hWxmamNNh1-RIpgPewyH_Iqqf1rCAyO-UqztVp4gqgej3zUXkh0-xnmr4EVVp5KW7VBnS8vP5-9rOyGFGNiWPb8Q3h-hgS0wPfDYN-6Fqn-FQ--vTay0xqB85KsBui6bsxgs2HhHXUy7al6YgP-HZH4wZVMBgJTCzDIVOtULEUPgTB7YfXg&token_type=Bearer&expires_in=3600'
    spotifyAPI.tempAccessToken = '';
    spotifyAPI.tokenStartPos = 42;
    spotifyAPI.tokenEndPos = 233;
    spotifyAPI.parseToken();
    expect(spotifyAPI.tempAccessToken)
    .toEqual('BQDZXbCZYEo5hWxmamNNh1-RIpgPewyH_Iqqf1rCAyO-UqztVp4gqgej3zUXkh0-xnmr4EVVp5KW7VBnS8vP5-9rOyGFGNiWPb8Q3h-hgS0wPfDYN-6Fqn-FQ--vTay0xqB85KsBui6bsxgs2HhHXUy7al6YgP-HZH4wZVMBgJTCzDIVOtULEUPgTB7YfXg');
  });

  it('should prepare a list of id for Spotify', () => {
    let spotifyAPI = new SpotifyApiService(<any> httpClientSpy);
    expect(spotifyAPI.prepareSpotifyURIs({"spotify_ids": ['1', '2']}))
    .toEqual({"uris": ['spotify:track:1', 'spotify:track:2']});
  });

});
