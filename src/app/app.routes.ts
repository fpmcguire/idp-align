import { Routes } from '@angular/router';
import { provideStreamObservationRepository } from './data/provide-stream-observation-repository';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    providers: [provideStreamObservationRepository()],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component').then(m => m.AboutComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
