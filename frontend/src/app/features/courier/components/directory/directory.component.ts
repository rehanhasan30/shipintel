import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourierService } from '../../services/courier.service';

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './directory.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DirectoryComponent implements OnInit {
  readonly courierService = inject(CourierService);

  ngOnInit() {
    this.courierService.loadCouriers();
  }

  retryLoad() {
    this.courierService.loadCouriers();
  }

  updateSearch(e: Event) {
    this.courierService.searchQuery.set((e.target as HTMLInputElement).value);
  }

  updateCoverage(e: Event) {
    this.courierService.filterCoverage.set((e.target as HTMLSelectElement).value);
  }

  updateMode(e: Event) {
    this.courierService.filterMode.set((e.target as HTMLSelectElement).value);
  }

  updateRating(e: Event) {
    this.courierService.filterRating.set((e.target as HTMLSelectElement).value);
  }

  resetFilters() {
    this.courierService.searchQuery.set('');
    this.courierService.filterCoverage.set('All');
    this.courierService.filterMode.set('All');
    this.courierService.filterRating.set('Any');
  }
}
