import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component'; // importáld a ProfileComponentet

export const routes: Routes = [
  { path: '', component: HomeComponent },  // A főoldal
  {
    path: 'profile/:id',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
