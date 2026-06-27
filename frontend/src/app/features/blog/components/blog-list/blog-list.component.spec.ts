import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BlogListComponent } from './blog-list.component';
import { BlogService } from '../../services/blog.service';
import { HttpService, ApiResponse } from '../../../../core/http/http.service';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('BlogListComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;
  let mockBlogService: any;
  let mockHttpService: any;

  beforeEach(async () => {
    mockBlogService = {
      articles: signal([
        { id: '1', title: 'Article 1', excerpt: 'Excerpt 1', category: 'Guides', author: 'Author 1', authorInitials: 'A1', highlighted: false },
        { id: '2', title: 'Article 2', excerpt: 'Excerpt 2', category: 'News', author: 'Author 2', authorInitials: 'A2', highlighted: true }
      ]),
      loading: signal(false),
      error: signal(null),
      loadArticles: jasmine.createSpy('loadArticles')
    };

    mockHttpService = jasmine.createSpyObj('HttpService', ['post']);

    await TestBed.configureTestingModule({
      imports: [BlogListComponent],
      providers: [
        { provide: BlogService, useValue: mockBlogService },
        { provide: HttpService, useValue: mockHttpService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger articles load on init', () => {
    expect(mockBlogService.loadArticles).toHaveBeenCalled();
  });

  it('should subscribe email address to newsletter successfully', () => {
    const mockResponse: ApiResponse<any> = {
      success: true,
      message: 'Subscribed',
      data: { email: 'test@example.com' },
      timestamp: new Date().toISOString()
    };
    mockHttpService.post.and.returnValue(of(mockResponse));

    component.emailVal = 'test@example.com';
    component.onSubscribeSubmit({ preventDefault: () => {} } as Event);

    expect(mockHttpService.post).toHaveBeenCalled();
    expect(component.subscribed()).toBeTrue();
  });
});
