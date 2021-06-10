import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Lista } from '../model/lista';
import { TarefaService } from './tarefa.service';

@Injectable({
  providedIn: 'root'
})

export class ListaService {
  constructor(private http: HttpClient, private tarefaService: TarefaService) { }

  list = (): Observable<Array<Lista>> => {
    return this.http.get<Array<Lista>>(`${environment.apiUrl}listas`);
  };

  get = (listaId: number): Observable<Lista> => {
    return this.http.get<Lista>(`${environment.apiUrl}listas/${listaId}`);
  };

  insert = (lista: Lista): Observable<Lista> => {
    return this.http.post<Lista>(`${environment.apiUrl}listas`, lista);
  }

  update = (lista: Lista): Observable<Lista> => {
    return this.http.put<Lista>(`${environment.apiUrl}listas/${lista.id}`, lista);
  }

  delete = (id: number): Observable<any> => {
    return this.http.delete(`${environment.apiUrl}listas/${id}`);
  }
}
