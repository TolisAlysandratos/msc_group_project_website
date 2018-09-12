import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WebApiService } from '../../services/web-api.service';
import { Router } from '@angular/router';
import { WordcloudComponent } from './wordcloud.component';

describe('WordcloudComponent', () => {
  let component: WordcloudComponent;
  let fixture: ComponentFixture<WordcloudComponent>;
  let webApiStub = {
    getReceivedAdjectives: function() {
      return true;
    },
    submitAdjectives: function(adj: string[]) {
      return true;
    }
  }
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ WordcloudComponent ],
      providers: [ { provide: WebApiService, useValue: webApiStub },
                  { provide: Router, useValue: routerSpy } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordcloudComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    let service = TestBed.get(WebApiService);
    component.adjectives = ['happy'];
    expect(component.submit()).toEqual(undefined);
  });

  it('should push adjective', () => {
    component.adjectives = ['happy'];
    component.select('sad');
    expect(component.adjectives.length).toEqual(2);
  });

  it('should remove adjective', () => {
    component.adjectives = ['happy', 'sad'];
    component.select('sad');
    expect(component.adjectives.length).toEqual(1);
  });

  it('should call submit', () => {
    component.adjectives = ['happy', 'sad'];
    component.select('depressed');
    expect(component.adjectives.length).toEqual(0);
  });

  it('should call ngOnInit()', () => {
    let serviceSpy = spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(serviceSpy).toHaveBeenCalled();
  });

});
