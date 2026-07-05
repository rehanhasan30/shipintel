import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../../../core/services/seo.service';
import { CourierService } from '../../services/courier.service';
import { Courier } from '../../models/courier.model';

@Component({
  selector: 'app-directory-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './directory-detail.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DirectoryDetailComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _courierService = inject(CourierService);
  private readonly _seoService = inject(SeoService);

  readonly courier = signal<Courier | undefined>(undefined);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this._route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCourierDetail(id);
      }
    });
  }

  loadCourierDetail(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this._courierService.getCourierDetail(id).subscribe({
      next: (data) => {
        if (data) {
          this.courier.set(data);
          
          // Set dynamic SEO titles, canonical link, OG tags, and structured data
          this._seoService.updateTitle(`${data.name} — Verified Courier Profile & SLA Ratings`);
          this._seoService.updateMetaTags({
            description: `View ${data.name} performance indexes, including ${data.transitTimeRating}% SLA adherence, ${data.billingAccuracy}% billing accuracy, and available service routes.`,
            type: 'profile'
          });
          this._seoService.updateCanonicalUrl();
          
          this._seoService.addStructuredData({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": data.name,
            "provider": {
              "@type": "LocalBusiness",
              "name": data.name,
              "image": "https://shipintel.in/assets/images/og-image.jpg"
            },
            "description": data.description,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": data.rating.toString(),
              "bestRating": "5",
              "ratingCount": "100"
            }
          });
        } else {
          this.error.set('Carrier profile not found in directory.');
        }
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  getServiceIcon(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('air') || n.includes('flight') || n.includes('priority')) return 'flight_takeoff';
    if (n.includes('ocean') || n.includes('sea') || n.includes('reefer')) return 'directions_boat';
    return 'local_shipping';
  }

  downloadRates() {
    alert(`Downloading rate sheet index for ${this.courier()?.name}...`);
  }
}
