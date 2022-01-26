import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './_services/auth-guard/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'transactions', pathMatch: 'full' },
  {
    path: 'account',
    loadChildren: () => import('../app/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'transactions',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../app/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: "**",
    redirectTo: "transactions"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
