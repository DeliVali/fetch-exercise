
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DogSearchComponent } from './component/dog-search/dog-search.component';
import { loginGuardGuard } from './guards/login-guard.guard';
import { searchGuard } from './guards/search.guard'

const routes: Routes = [{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate:[loginGuardGuard],
    title: 'Login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'search',
    canActivate:[searchGuard],
    title: 'Search your type of dogs',
    component: DogSearchComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
