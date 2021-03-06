import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
registerLocaleData(localeNl);

import { AppMaterialModule } from '../../../../app.material-module';
import { IexWidgetComponent } from './iex-widget.component';
import { IexChartComponent } from '../../../../charts/iex-chart/iex-chart.component';
import { IexService } from '../../../../services/iex/iex.service';
import { IexDayItem, IexLongtermItem } from '../../../../models/iex-items';
import { asyncData, asyncError } from '../../../../testing/async-observable-helpers';
import { stubIexDayItems } from '../../../../testing/stub-iex-data';
import { DateIsoPipe } from '../../../../pipes/date-iso.pipe';

describe('IexWidgetComponent', () => {
  let component: IexWidgetComponent;
  let fixture: ComponentFixture<IexWidgetComponent>;
  let el: HTMLElement;
  let iexService: jasmine.SpyObj<{}>;
  let routerSpy: jasmine.SpyObj<{}>;

  beforeEach(() => {
    iexService = jasmine.createSpyObj('IexService', ['getWidgetData']);
    TestBed.configureTestingModule({
      imports: [AppMaterialModule],
      declarations: [IexWidgetComponent, IexChartComponent, DateIsoPipe],
      providers: [
        { provide: IexService, useValue: iexService },
        { provide: Router, useValue: routerSpy }
      ]
    })
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IexWidgetComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('should create', () => {
    (<any>iexService).getWidgetData.and.returnValue(asyncData(stubIexDayItems));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('displays stock data', async(() => {
    (<any>iexService).getWidgetData.and.returnValue(asyncData(stubIexDayItems));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const companySymbol = el.querySelector('.company-symbol') as Element;
      expect(companySymbol.textContent).toBe('AAAA');
      const price = el.querySelector('.quote-info-top-right') as Element;
      expect(price.textContent).toBe('$ 217,50');
    });
  }));

  it('passes stock data to the iex-chart-component', () => {
    (<any>iexService).getWidgetData.and.returnValue(asyncData(stubIexDayItems));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.companyData.subscribe(data => {
        expect((<IexDayItem[]>data)[0]).toEqual(stubIexDayItems[0]);
      })
    });
  });

  it('displays an error message when IexService fails', async(() => {
    (<any>iexService).getWidgetData.and.returnValue(asyncError({ error: 'IexService test failure' }));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const errMessage = el.querySelector('.error-message');
      expect((<HTMLElement>errMessage).textContent).toMatch(/test failure/);
    });
  }));

});
