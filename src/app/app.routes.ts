import { Route, Routes } from '@angular/router';

/** A demo page. Adding an entry here also adds it to the sidebar. */
type DemoRoute = Route & { path: string; label: string };

export const demos: DemoRoute[] = [
  {
    path: 'button',
    label: 'Button',
    loadComponent: () => import('./demos/button/button-demo').then((m) => m.ButtonDemo),
  },
  {
    path: 'label',
    label: 'Label',
    loadComponent: () => import('./demos/label/label-demo').then((m) => m.LabelDemo),
  },
];

export const routes: Routes = [
  { path: '', redirectTo: demos[0].path, pathMatch: 'full' },
  ...demos,
];
