import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    data: {
      title: 'ShipIntel — India\'s Most Trusted Logistics Intelligence Platform',
      description: 'Compare freight rates, calculate volumetric weights, evaluate carrier performance, and search directory list of verified couriers on ShipIntel.'
    }
  },
  {
    path: 'calculators',
    loadComponent: () => import('./features/calculator/components/calculators.component').then(m => m.CalculatorsComponent),
    data: {
      title: 'Logistics Rate & Volumetric Calculator Hub — ShipIntel',
      description: 'Calculate volumetric shipping weights, compare real-time domestic & international freight rates, and find cheapest carrier index.'
    }
  },
  {
    path: 'directory',
    loadComponent: () => import('./features/courier/components/directory/directory.component').then(m => m.DirectoryComponent),
    data: {
      title: 'Courier & Carrier Performance Directory — ShipIntel',
      description: 'Search and filter verified global and regional shipping providers, review SLA transit times, damage claims, and coverage.'
    }
  },
  {
    path: 'directory/:id',
    loadComponent: () => import('./features/courier/components/directory-detail/directory-detail.component').then(m => m.DirectoryDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'resources',
    loadComponent: () => import('./features/blog/components/blog-list/blog-list.component').then(m => m.BlogListComponent),
    data: {
      title: 'Logistics Strategic Insights & Industry News — ShipIntel',
      description: 'Read the latest industry news, guides, and carbon accounting manuals for modern supply chains.'
    }
  },
  {
    path: 'resources/:id',
    loadComponent: () => import('./features/blog/components/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/components/about.component').then(m => m.AboutComponent),
    data: {
      title: 'About Us & Our Core Values — ShipIntel',
      description: 'Learn about our mission to build precision engineering tools for Indian and global supply chains.'
    }
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/components/contact.component').then(m => m.ContactComponent),
    canActivate: [authGuard],
    data: {
      title: 'Contact Support — ShipIntel',
      description: 'Get in touch with our team for technical support, carrier registration, or customized freight calculators.'
    }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
