import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {environment } from '../../../environments/environment';

import { NosNewsService } from './nos-news.service';
import { NewsItem } from '../../models/news-item';

describe('NosNewsService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: NosNewsService;
  const baseUrl = environment.backendBaseUrl;
  const stubNewsItem: NewsItem = {
    title: 'stub title',
    trailText: 'stub trail text',
    thumbnail: '',
    body: 'stub body text'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NosNewsService],
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(NosNewsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('its getWidgetNews method return an observable of an array of news items', () => {
    const stubResponse = Array(3).fill(stubNewsItem);
    const testResponse = { name: 'test-response' };
    service.getWidgetNews().subscribe(res => {
      expect(res).toEqual(stubResponse);
    });
    const req = httpTestingController.expectOne(baseUrl + '/nos-news?page-size=3');
    expect(req.request.method).toEqual('GET');
    req.flush(stubResponse);
  });

  it('its getPageNews method returns an observable of an array of news items', () => {
    const stubResponse = Array(20).fill(stubNewsItem);
    service.getPageNews()
      .subscribe(res => {
        expect(res).toEqual(stubResponse);
      });
    const req = httpTestingController.expectOne(baseUrl + '/nos-news?page-size=20&include-body=true');
    expect(req.request.method).toEqual('GET');
    req.flush(stubResponse);
  });
});
