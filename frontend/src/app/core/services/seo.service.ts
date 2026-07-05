import { inject, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly _title = inject(Title);
  private readonly _meta = inject(Meta);
  private readonly _document = inject(DOCUMENT);

  updateTitle(title: string) {
    this._title.setTitle(title);
    this._meta.updateTag({ property: 'og:title', content: title });
    this._meta.updateTag({ name: 'twitter:title', content: title });
  }

  updateMetaTags(config: { description: string, image?: string, type?: string, url?: string }) {
    this._meta.updateTag({ name: 'description', content: config.description });
    this._meta.updateTag({ property: 'og:description', content: config.description });
    this._meta.updateTag({ name: 'twitter:description', content: config.description });

    // Open Graph
    this._meta.updateTag({ property: 'og:type', content: config.type || 'website' });
    this._meta.updateTag({ property: 'og:image', content: config.image || 'https://shipintel.in/assets/images/og-image.jpg' });
    this._meta.updateTag({ property: 'og:url', content: config.url || this._document.URL });

    // Twitter Card
    this._meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this._meta.updateTag({ name: 'twitter:image', content: config.image || 'https://shipintel.in/assets/images/og-image.jpg' });
  }

  updateCanonicalUrl(url?: string) {
    const linkUrl = url || this._document.URL;
    let link: HTMLLinkElement | null = this._document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this._document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this._document.head.appendChild(link);
    }
    link.setAttribute('href', linkUrl);
  }

  addStructuredData(schema: any) {
    // Remove existing structured data scripts
    const existingScripts = this._document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    const script = this._document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this._document.head.appendChild(script);
  }
}
