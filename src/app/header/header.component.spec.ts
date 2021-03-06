import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { AppMaterialModule } from '../app.material-module';
import { HeaderComponent } from './header.component';
import { Breakpoints } from '../models/breakpoints';
import { BreakpointsService } from '../services/breakpoints/breakpoints.service';


describe('HeaderComponent', () => {

  class StubBreakpointsService {
    breakpoints$ = new Subject<Breakpoints>();
  }

  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerEl: HTMLElement;
  let breakpointService: BreakpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [AppMaterialModule, RouterTestingModule],
      providers: [
        { provide: BreakpointsService, useClass: StubBreakpointsService }
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    headerEl = fixture.nativeElement;
    breakpointService = TestBed.get(BreakpointsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('nav button is shown on small and medium screens but not on large screens', () => {
    let button = headerEl.querySelector('button')
    expect(button).toBeDefined();
    (<any>breakpointService.breakpoints$).next({ tablet: true, medium: true, large: true });
    fixture.detectChanges();
    button = headerEl.querySelector('.menu-button');
    expect(button).toBeNull();
  });

  it('clicking the nav button emits a toggle sidenav event', () => {
    const buttonDe = fixture.debugElement.query(By.css('.menu-button'));
    component.toggleEvent.subscribe((ev: boolean) => {
      expect(ev).toBeTruthy();
    })
    buttonDe.triggerEventHandler('click', true);
  });
});
