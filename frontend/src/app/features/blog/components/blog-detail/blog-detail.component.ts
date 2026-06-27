import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { BlogService } from '../../services/blog.service';
import { Article } from '../../models/blog.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-detail.component.html',
  styles: [`
    :host {
      display: block;
    }
    
    /* Global styles injected into innerHTML prose elements */
    ::ng-deep .prose h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #191c1e;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }
    ::ng-deep .prose p {
      font-size: 0.95rem;
      color: #434655;
      margin-bottom: 1rem;
      line-height: 1.625;
    }
    ::ng-deep .prose blockquote {
      border-left: 4px solid #004ac6;
      padding-left: 1rem;
      font-style: italic;
      color: #191c1e;
      margin: 1.5rem 0;
      background-color: #f2f4f6;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      border-radius: 0 0.5rem 0.5rem 0;
    }
    ::ng-deep .prose ul {
      list-style-type: disc;
      padding-left: 1.25rem;
      margin-bottom: 1rem;
    }
    ::ng-deep .prose li {
      margin-bottom: 0.25rem;
      font-size: 0.95rem;
      color: #434655;
    }
    ::ng-deep .prose ol {
      list-style-type: decimal;
      padding-left: 1.25rem;
      margin-bottom: 1rem;
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _blogService = inject(BlogService);
  private readonly _titleService = inject(Title);
  private readonly _metaService = inject(Meta);

  readonly article = signal<Article | undefined>(undefined);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this._route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadArticleDetail(id);
      }
    });
  }

  loadArticleDetail(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this._blogService.getArticleDetail(id).subscribe({
      next: (data) => {
        if (data) {
          this.article.set(data);
          
          // Set dynamic SEO titles and meta tags based on retrieved article title
          this._titleService.setTitle(`${data.title} — ShipIntel Logistics Insights`);
          this._metaService.updateTag({
            name: 'description',
            content: data.excerpt || `Read the detailed guide on ${data.title} inside the ShipIntel strategic resources hub.`
          });
        } else {
          this.error.set('Requested article was not found.');
        }
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
