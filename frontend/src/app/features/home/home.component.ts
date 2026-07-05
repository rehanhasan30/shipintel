import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface SearchResultDto {
  type: 'TRACKING' | 'COURIER' | 'ARTICLE' | 'CALCULATOR';
  title: string;
  description: string;
  url: string;
  score: number;
  
  carrierName?: string;
  trackingNumber?: string;
  supportEmail?: string;
  supportPhone?: string;
  logoBgClass?: string;
  logoInitials?: string;
  tab?: string;
  category?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent {
  private readonly _http = inject(HttpClient);

  searchVal = '';
  searchLoading = signal(false);
  searchResult = signal<SearchResultDto[] | null>(null);

  onInputChange(event: Event) {
    this.searchVal = (event.target as HTMLInputElement).value;
    if (!this.searchVal.trim()) {
      this.searchResult.set(null);
    }
  }

  executeUniversalSearch() {
    const query = this.searchVal.trim();
    if (!query) {
      this.searchResult.set(null);
      return;
    }

    this.searchLoading.set(true);
    const url = `${environment.apiBaseUrl}/api/v1/search?q=${encodeURIComponent(query)}`;

    this._http.get<{ success: boolean; data: SearchResultDto[] }>(url).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.searchResult.set(res.data);
        } else {
          this.searchResult.set([]);
        }
        this.searchLoading.set(false);
      },
      error: () => {
        this.searchResult.set([]);
        this.searchLoading.set(false);
      }
    });
  }

  openCustomCarrierTracking(trackingUrlTemplate: string) {
    const trackingUrl = trackingUrlTemplate.replace('{AWB}', this.searchVal.trim());
    window.open(trackingUrl, '_blank', 'noopener,noreferrer');
  }
}
