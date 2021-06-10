import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Categoria } from '../model/categoria';

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {
  constructor(private http: HttpClient) { }

  list = (): Observable<Array<Categoria>> => {
    return this.http.get<Array<Categoria>>(`${environment.apiUrl}categorias`);
  };

  get = (categoriaId: number): Observable<Categoria> => {
    return this.http.get<Categoria>(`${environment.apiUrl}categorias/${categoriaId}`);
  };

  insert = (categoria: Categoria): Observable<Categoria> => {
    return this.http.post<Categoria>(`${environment.apiUrl}categorias`, categoria);
  }

  update = (categoria: Categoria): Observable<Categoria> => {
    return this.http.put<Categoria>(`${environment.apiUrl}categorias/${categoria.id}`, categoria);
  }


  delete = (id: number): Observable<any> => {
    return this.http.delete(`${environment.apiUrl}categorias/${id}`);
  }
}
