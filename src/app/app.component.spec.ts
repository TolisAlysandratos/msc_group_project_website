import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { EmojisComponent } from './components/emojis/emojis.component';
import { WordcloudComponent } from './components/wordcloud/wordcloud.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: '', component: WelcomeComponent },
          { path: 'emojis', component: EmojisComponent },
          { path: 'wordcloud', component: WordcloudComponent },
          { path: 'playlist', component: PlaylistComponent },
          { path: 'about', component: AboutusComponent },
          { path: '**', component: NotfoundComponent }
        ])
      ],
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
      providers: [
        { provide: APP_BASE_HREF, useValue : '/' }
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
