import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../../services/web-api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-wordcloud',
  templateUrl: './wordcloud.component.html',
  styleUrls: ['./wordcloud.component.scss']
})
export class WordcloudComponent implements OnInit {

  adjectives: string[] = [];
  adjectiveLabels: string[] = [];
  adjJSON: any = { "adjectives": "" };

  constructor(private webAPI: WebApiService,
              private router: Router) { }

  ngOnInit() {
    // Retrieves adjectives from the back-end
    this.adjectiveLabels = this.webAPI.getReceivedAdjectives();
  }

  // Takes in the user's selected adjectives through button clicks
  // Stores the selected adjectives in a list for the back-end
  select(adj: string) {
    if (this.adjectives.indexOf(adj) < 0) {
      this.adjectives.push(adj);
      if (this.adjectives.length == 3) {
        this.submit();
      }
    }
    else {
      this.adjectives.splice(this.adjectives.indexOf(adj), 1);
    }
  }

  // Submits the user-selected adjectives to the back-end
  submit() {
    if (this.adjectives.length > 0) {
      this.adjJSON.adjectives = this.adjectives;
      this.webAPI.submitAdjectives(this.adjJSON);
      this.router.navigateByUrl('/playlist');
      this.adjectives = [];
    }
  }

}
