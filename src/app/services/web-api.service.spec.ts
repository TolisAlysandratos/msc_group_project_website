import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { WebApiService } from './web-api.service';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('WebApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        WebApiService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });

  it('should return an Observable<Array<IDs>>',
    inject([WebApiService, XHRBackend], (webAPI, mockBackend) => {

      const mockResponse = {
        adjectives: ['sad', 'depressed']
      };

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      webAPI.submitEmoji({ "emojis": ['stupid_face'] }).subscribe((trackInfo) => {
        expect(trackInfo.adjectives).toEqual(['sad', 'depressed']);
      });

  }));

  it('should return an Observable<Array<IDs>> from submitAdjectives',
    inject([WebApiService, XHRBackend], (webAPI, mockBackend) => {

      const mockResponse = {
        ids: ['id1', 'id2']
      };

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      webAPI.submitAdjectives({ "adjectives": ['sad', 'depressed'] });
      expect(webAPI.backendSpotifyIDs.ids).toEqual(['id1', 'id2']);

  }));

  let httpClientSpy: { get: jasmine.Spy };
  let webAPI: WebApiService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    webAPI = new WebApiService(<any> httpClientSpy);
  });

  it('should be created', () => {
    expect(webAPI).toBeTruthy();
  });

  it('should create RequestOptions object for POST', () => {
    expect(webAPI.postOptions()).not.toBeNull();
  });

  it('should return backendSpotifyIDs', () => {
    expect(webAPI.getBackendSpotifyIDs()).toEqual(webAPI.backendSpotifyIDs);
  });

  it('should return receivedAdjectives', () => {
    expect(webAPI.getReceivedAdjectives()).toEqual(webAPI.receivedAdjectives);
  });

  it('should set receivedAdjectives', () => {
    webAPI.setReceivedAdjectives(['adj1','adj2']);
    expect(webAPI.receivedAdjectives).toEqual(['adj1','adj2']);
  });


});
