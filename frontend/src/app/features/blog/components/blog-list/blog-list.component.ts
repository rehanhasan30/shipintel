import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { HttpService } from '../../../../core/http/http.service';
import { API_CONSTANTS } from '../../../../core/constants/api.constants';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-list.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BlogListComponent implements OnInit {
  readonly blogService = inject(BlogService);
  private readonly _httpService = inject(HttpService);
  
  emailVal = '';
  subscribed = signal(false);
  newsletterLoading = signal(false);

  ngOnInit() {
    this.blogService.loadArticles();
  }

  retryLoad() {
    this.blogService.loadArticles();
  }

  onEmailChange(event: Event) {
    this.emailVal = (event.target as HTMLInputElement).value;
  }

  onSubscribeSubmit(e: Event) {
    e.preventDefault();
    if (!this.emailVal.trim()) return;
    
    this.newsletterLoading.set(true);
    this._httpService.post(API_CONSTANTS.NEWSLETTER_SUBSCRIBE, { email: this.emailVal }).subscribe({
      next: (res) => {
        if (res.success) {
          this.subscribed.set(true);
        }
        this.newsletterLoading.set(false);
      },
      error: () => {
        this.newsletterLoading.set(false);
      }
    });
  }

  loadMore() {
    alert("All current Phase 1 strategic articles have been loaded.");
  }
}
