import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { BreakpointsService } from '../../services/breakpoints/breakpoints.service';
import { OpenweathermapItem } from '../../models/openweathermap-item';
import { OpenweathermapDataService } from '../../services/openweathermap-data/openweathermap-data.service';
import { OpenweathermapHelpersService } from '../../services/openweathermap-helpers/openweathermap-helpers.service';

@Component({
  selector: 'jr-openweathermap-page',
  templateUrl: './openweathermap-page.component.html',
  styleUrls: ['./openweathermap-page.component.scss']
})
export class OpenweathermapPageComponent implements OnInit, OnDestroy {

  columns = 1;
  breakpointsSubscription!: Subscription;
  items: OpenweathermapItem[] = [];
  selectedCity: OpenweathermapItem | undefined;
  errorMessage = '';
  selectedCityStyle = {};
  pageContentStyle = {};

  constructor(private breakpointsService: BreakpointsService, private openweathermapDataService: OpenweathermapDataService, private openweathermapHelpersService: OpenweathermapHelpersService) { }

  ngOnInit() {
    this.breakpointsSubscription = this.breakpointsService.breakpoints$.subscribe(screenSize => {
      if (screenSize.medium || screenSize.large) {
        this.columns = 2;
        this.pageContentStyle = {
          'flex-flow': 'row',
          'justify-content': 'center'
        }
        this.selectedCityStyle = {
          'order': '2',
          'max-width': 'none',
          'margin-left': '16px',
          'margin-top': '8px',
          // To prevent overflow (see: https://stackoverflow.com/questions/12022288/how-to-keep-a-flex-item-from-overflowing-due-to-its-text)
          'min-width': 0
        }
      } else {
        this.columns = 1;
        this.pageContentStyle = {
          'max-width': '600px',
          'margin': '0 auto'
        };
        this.selectedCityStyle = {};
      }
    });

    this.openweathermapDataService.getPageWeather().subscribe(res => {
      const weatherData = res.map(cityData => this.openweathermapHelpersService.handleWeatherData(cityData, undefined));
      this.items = weatherData;

      let city = 'utrecht';
      const cookies = document.cookie.split(';');
      const cityKeyValue = cookies.filter((item) => item.includes('dashboardMdOpenweathermapCity='));
      if (cityKeyValue.length) {
        const cityValue = cityKeyValue[0].split('=')[1];
        city = cityValue;
      }
      this.selectedCity = this.items.find(item => item.city === city);
    },
      (err: HttpErrorResponse) => {
        this.errorMessage = err.error;
        return of();
      });
  }

  ngOnDestroy() {
    this.breakpointsSubscription.unsubscribe();
  }

  windSpeedBeaufort(speed: number) {
    return this.openweathermapHelpersService.windSpeedBeaufort(speed);
  }

  windDirection(degree: number) {
    return this.openweathermapHelpersService.windDirection(degree);
  }

  selectItem(item: any) {
    this.selectedCity = item;
    window.scrollTo({ top: 0, behavior: 'auto' });
    const city = item.city;
    document.cookie = "dashboardMdOpenweathermapCity=" + city + "; max-age=31536000"; // max-age is 60*60*24*365 seconds = 1 year
  }
}
