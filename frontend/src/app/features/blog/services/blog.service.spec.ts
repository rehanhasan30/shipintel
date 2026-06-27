import { TestBed } from '@angular/core/testing';
import { BlogService } from './blog.service';
import { HttpService, ApiResponse } from '../../../core/http/http.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MOCK_ARTICLES } from '../../../core/data/mock/blog-articles.mock';

describe('BlogService', () => {
  let service: BlogService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpService', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [
        BlogService,
        { provide: HttpService, useValue: spy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(BlogService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load articles and update signal', () => {
    const mockResponse: ApiResponse<any[]> = {
      success: true,
      message: 'Articles loaded',
      data: MOCK_ARTICLES,
      timestamp: new Date().toISOString()
    };

    httpServiceSpy.get.and.returnValue(of(mockResponse));

    service.loadArticles();

    expect(service.loading()).toBeFalse();
    expect(service.error()).toBeNull();
    expect(service.articles()).toEqual(MOCK_ARTICLES);
  });

  it('should fetch single article detail', (done) => {
    const mockArticle = MOCK_ARTICLES[0];
    const mockResponse: ApiResponse<any> = {
      success: true,
      message: 'Article loaded',
      data: mockArticle,
      timestamp: new Date().toISOString()
    };

    httpServiceSpy.get.and.returnValue(of(mockResponse));

    service.getArticleDetail(mockArticle.id).subscribe({
      next: (article) => {
        expect(article).toEqual(mockArticle);
        done();
      }
    });
  });
});
