import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SeoService } from './core/services/seo.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('ShipIntel');
  
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _seoService = inject(SeoService);
  private _routerSub?: Subscription;

  ngOnInit() {
    this._routerSub = this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this._activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe({
      next: (data) => {
        if (data['title']) {
          this._seoService.updateTitle(data['title']);
        }
        if (data['description']) {
          this._seoService.updateMetaTags({ description: data['description'] });
        }
        this._seoService.updateCanonicalUrl();
      }
    });
  }

  ngOnDestroy() {
    this._routerSub?.unsubscribe();
  }
}
