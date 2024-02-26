import { Routes } from '@angular/router';
import { admin, root, ticketBooth, user } from '../constants/Routes';
import { ErrorPage } from './pages/error-page/error-page.component';

export const routes: Routes = [
  root,
  admin,
  user,
  ticketBooth,
  {
    path:'**',
    component: ErrorPage
  }
];
