import { Routes } from '@angular/router';
import { Starter } from './features/starter/starter';
import { Demo } from './features/demo/demo';

export const routes: Routes = [
  { path: '', component: Starter },
  { path: 'demo', component: Demo },
  { path: '**', redirectTo: '' }
];
