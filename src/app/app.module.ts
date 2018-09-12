import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import 'rxjs/Rx';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { EmojisComponent } from './components/emojis/emojis.component';
import { WordcloudComponent } from './components/wordcloud/wordcloud.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

import { WebApiService } from './services/web-api.service';
import { SpotifyAudioService } from './services/spotify-audio.service';
import { SpotifyApiService } from './services/spotify-api.service';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    EmojisComponent,
    WordcloudComponent,
    PlaylistComponent,
    NotfoundComponent,
    AboutusComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: WelcomeComponent },
      { path: 'emojis', component: EmojisComponent },
      { path: 'wordcloud', component: WordcloudComponent },
      { path: 'playlist', component: PlaylistComponent },
      { path: 'about', component: AboutusComponent },
      { path: '**', component: NotfoundComponent }
    ]),
    HttpModule
  ],
  providers: [WebApiService, SpotifyApiService, SpotifyAudioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
