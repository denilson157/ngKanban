import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component'
import { ListaComponent } from './views/lista/lista.component'
import { CategoriaComponent } from './views/categoria/categoria.component'

const routes: Routes = [
  { path: 'lista', component: ListaComponent },
  { path: 'categoria', component: CategoriaComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
