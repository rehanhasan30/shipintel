import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface TrackingState {
  number: string;
  status: 'idle' | 'loading' | 'found' | 'error';
  carrier?: string;
  eta?: string;
  location?: string;
  lastUpdate?: string;
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
  searchVal = '';
  tracking = signal<TrackingState>({
    number: '',
    status: 'idle'
  });

  onInputChange(event: Event) {
    this.searchVal = (event.target as HTMLInputElement).value;
  }

  trackShipment() {
    const num = this.searchVal.toUpperCase().trim();
    if (!num) return;

    this.tracking.set({
      number: num,
      status: 'loading'
    });

    // Simulate Network Request Delay
    setTimeout(() => {
      if (num === 'SHIP-9824') {
        this.tracking.set({
          number: num,
          status: 'found',
          carrier: 'SwiftLogix Global',
          eta: 'June 29, 2026',
          location: 'Hub Mumbai (BOM)',
          lastUpdate: 'Out for customs clearance'
        });
      } else if (num === 'SHIP-7711') {
        this.tracking.set({
          number: num,
          status: 'found',
          carrier: 'Meridian Freight',
          eta: 'July 05, 2026',
          location: 'Suez Canal Transit',
          lastUpdate: 'Vessel departure confirmed'
        });
      } else {
        this.tracking.set({
          number: num,
          status: 'error'
        });
      }
    }, 1200);
  }
}
