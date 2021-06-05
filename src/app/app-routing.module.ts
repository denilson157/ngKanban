import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component'
import { ListaComponent } from './views/lista/lista.component'

const routes: Routes = [
  { path: 'lista', component: ListaComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
