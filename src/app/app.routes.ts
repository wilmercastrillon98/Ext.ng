import { Route, Routes } from '@angular/router';

/** A demo page. Adding an entry here also adds it to the sidebar. */
type DemoRoute = Route & { path: string; label: string };

export const demos: DemoRoute[] = [
  {
    path: 'button',
    label: 'Button',
    loadComponent: () => import('./demos/button/button-demo').then((m) => m.ButtonDemo),
  },
];

export const routes: Routes = [
  { path: '', redirectTo: demos[0].path, pathMatch: 'full' },
  ...demos,
];
