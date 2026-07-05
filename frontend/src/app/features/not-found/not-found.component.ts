import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="flex flex-col items-center justify-center min-h-[70vh] px-margin-mobile md:px-margin-desktop text-center py-stack-xl">
      <div class="max-w-md space-y-6">
        <h1 class="text-display-xl font-display-xl text-primary animate-bounce">404</h1>
        <h2 class="text-headline-md font-headline-md text-on-surface">Page Not Found</h2>
        <p class="text-body-md font-body-md text-on-surface-variant">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div class="pt-6">
          <a routerLink="/" class="inline-flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary-container active:scale-95 transition-all shadow-sm">
            <span class="material-symbols-outlined text-[20px]">home</span>
            Return to Homepage
          </a>
        </div>
      </div>
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NotFoundComponent {
  private readonly _seoService = inject(SeoService);

  constructor() {
    this._seoService.updateTitle('404 Page Not Found — ShipIntel');
    this._seoService.updateMetaTags({ description: 'The requested page was not found on ShipIntel.' });
  }
}
