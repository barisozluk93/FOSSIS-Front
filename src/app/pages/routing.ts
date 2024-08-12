import { Routes } from '@angular/router';
import { AuthGuard } from '../modules/auth/services/auth.guard';

const Routing: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'map',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../modules/map/map.module').then((m) => m.MapModule),
  },
  {
    path: 'organizationmanagement',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../modules/organization-management/organization-management.module').then((m) => m.OrganizationManagementModule),
  },
  {
    path: 'usermanagement',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../modules/user-management/user-management.module').then((m) => m.UserManagementModule),
  },
  {
    path: 'materialmanagement',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../modules/material-management/material-management.module').then((m) => m.MaterialManagementModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
