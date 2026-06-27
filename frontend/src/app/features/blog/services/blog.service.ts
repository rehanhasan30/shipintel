import { Injectable, signal, inject } from '@angular/core';
import { HttpService } from '../../../core/http/http.service';
import { Article } from '../models/blog.model';
import { API_CONSTANTS } from '../../../core/constants/api.constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly _httpService = inject(HttpService);

  readonly articles = signal<Article[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /**
   * Fetch all blog articles from the API layer
   */
  loadArticles(): void {
    this.loading.set(true);
    this.error.set(null);

    this._httpService.get<Article[]>(API_CONSTANTS.BLOG_ARTICLES).subscribe({
      next: (res) => {
        if (res.success) {
          this.articles.set(res.data);
        } else {
          this.error.set(res.message);
        }
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  /**
   * Fetch details for a specific article
   */
  getArticleDetail(id: string): Observable<Article | undefined> {
    return this._httpService.get<Article>(API_CONSTANTS.BLOG_ARTICLE_DETAIL(id)).pipe(
      map(res => res.success ? res.data : undefined)
    );
  }
}
