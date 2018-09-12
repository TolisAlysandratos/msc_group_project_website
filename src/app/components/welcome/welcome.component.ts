import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { SpotifyApiService } from '../../services/spotify-api.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  authenticated : boolean = false;

  constructor(private router: Router,public spotifyAPI: SpotifyApiService) {
  }

  ngOnInit() {
    if (window.location.href.includes("access_token")) {
      this.spotifyAPI.setFullUrl(window.location.toString());
      this.router.navigateByUrl('/emojis');
    }
  }

}
