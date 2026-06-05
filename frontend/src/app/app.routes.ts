import { Routes } from '@angular/router';
import { Starter } from './features/starter/starter';
import { Demo } from './features/demo/demo';
import { SuggestedFlow } from './features/suggested-flow/suggested-flow';

export const routes: Routes = [
  { path: '', component: Starter },
  { path: 'demo', component: Demo },
  { path: 'suggested-flow', component: SuggestedFlow },
  { path: '**', redirectTo: '' }
];
