import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../../services/web-api.service';
import { SpotifyApiService } from '../../services/spotify-api.service';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-emojis',
  templateUrl: './emojis.component.html',
  styleUrls: ['./emojis.component.css']
})
export class EmojisComponent {

  codes: string[] = [];
  testEmoji: string = String.fromCharCode(0x1f600);
  codesJSON: any = { "emojis": "" };
  receivedAdjectives: any = {};

  constructor(public webAPI: WebApiService,
              private router: Router,
              private spotifyAPI: SpotifyApiService) {
                    this.spotifyAPI.parseToken();
              }

  // Takes in the user's selected emojis through icon clicks
  // Stores the selected emojis codesin a list for the back-end
  select(code: string) {
    if (this.codes.indexOf(code) < 0) {
      this.codes.push(code);
      if (this.codes.length == 3) {
        this.submit();
      }
    }
    else {
      this.codes.splice(this.codes.indexOf(code), 1);
    }
  }

  // Submits the user-selected emojis to the back-end and receives/sets the
  // generated adjectives
  submit() {
    if (this.codes.length > 0) {
      this.codesJSON.emojis = this.codes;
      this.webAPI.submitEmoji(this.codesJSON)
                  .subscribe(adjectives => {
                    this.receivedAdjectives = adjectives;
                    this.webAPI.setReceivedAdjectives(this.receivedAdjectives.adjectives);
                    this.router.navigateByUrl('/wordcloud');
               });

    }

  }
}
