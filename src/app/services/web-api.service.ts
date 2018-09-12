import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { EventEmitter } from '@angular/core';

@Injectable()
export class WebApiService {

  prox: number = 1.5;
  receivedAdjectives: string[] = [];
  res2: any = {};
  backendSpotifyIDs: any = {};

  constructor(private http: Http) {}

  // Return POST request RequestOptions object containing headers
  postOptions() {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: header });

    return options;
  }

  // Getter function that returns the Spotify IDs JSON
  getBackendSpotifyIDs() {
    return this.backendSpotifyIDs;
  }

  // Makes a POST request to the backend taking the user's selected emojis
  // Retrieves and returns a list of related adjectives
  submitEmoji(codes: any) {
    const options = this.postOptions();
    return this.http.post(`https://mmapl.azurewebsites.net/api/emojis`,
                          JSON.stringify(codes), options)
                    .map(res => res.json());
  }

  // Sets the values of receivedAdjectives array
  setReceivedAdjectives(adjectives: string[]) {
    this.receivedAdjectives = adjectives;
  }

  // Returns receivedAdjectives array
  getReceivedAdjectives() {
    return this.receivedAdjectives;
  }

  // Takes the list of user-selected adjectives as input
  // Makes a POST request to the back-end and retrieves
  // a list of the the relevant Spotify track IDs
  submitAdjectives(adjectives: any) {
    const options = this.postOptions();
    this.http.post(`https://mmapl.azurewebsites.net/api/adjectives`,
                    JSON.stringify(adjectives), options)
             .map(res => res.json())
             .subscribe(res => {
               this.res2 = res;
               this.res2.proximity = this.prox;
               this.http.post(`https://mmapl.azurewebsites.net/api/songs/va`,
                              JSON.stringify(res), options)
                        .map(res3 => res3.json())
                        .subscribe(res3 => {
                                     this.backendSpotifyIDs = res3;
                                  });
             });
  }

}
