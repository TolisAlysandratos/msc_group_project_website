import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WebApiService } from '../../services/web-api.service';
import { SpotifyApiService } from '../../services/spotify-api.service';
import { EmojisComponent } from './emojis.component';
import { Router } from '@angular/router';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';


describe('EmojisComponent', () => {
  let component: EmojisComponent;
  let fixture: ComponentFixture<EmojisComponent>;

  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    let webApiStub = {
      submitEmoji: function() {
        return new EmptyObservable();
      }
    };
    let spotifyApiStub = {};

    TestBed.configureTestingModule({
      declarations: [ EmojisComponent ],
      providers: [ { provide: WebApiService, useValue: webApiStub},
                   { provide: SpotifyApiService, useValue: spotifyApiStub },
                   { provide: Router, useValue: routerSpy } ]
    })
    .compileComponents();

    webApiStub = TestBed.get(WebApiService);
    spotifyApiStub = TestBed.get(SpotifyApiService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmojisComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add code to codes', () => {
    component.select("code1");
    expect(component.codes).toEqual(["code1"]);
  });

  it('should call submit()', () => {
    component.codes = ['1','2'];
    component.webAPI = fixture.debugElement.injector.get(WebApiService);
    let submitSpy = spyOn(component, 'submit').and.callThrough();
    component.select("code1");
    expect(component.codes.length).toBe(3);
    expect(submitSpy).toHaveBeenCalled();
  });

  it('should remove code', () => {
    component.codes = ['1','2'];
    component.select('1');
    expect(component.codes).toEqual(['2']);
  });

});
