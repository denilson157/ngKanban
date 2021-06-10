import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tarefa } from '../model/tarefa';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  constructor(private http: HttpClient) { }

  insert = (tarefa: Tarefa): Observable<Tarefa> => {
    return this.http.post<Tarefa>(`${environment.apiUrl}tarefas`, tarefa);
  }

  list = (): Observable<Array<Tarefa>> => {
    return this.http.get<Array<Tarefa>>(`${environment.apiUrl}tarefas`);
  };

  get = (tarefaId: number): Observable<Tarefa> => {
    return this.http.get<Tarefa>(`${environment.apiUrl}tarefas/${tarefaId}`);
  };

  update = (tarefa: Tarefa): Observable<Tarefa> => {
    return this.http.put<Tarefa>(`${environment.apiUrl}tarefas/${tarefa.id}`, tarefa);
  }

  delete = (id: number): Observable<any> => {
    return this.http.delete(`${environment.apiUrl}tarefas/${id}`);
  }

  // insert = (tarefa: Tarefa): Observable<Tarefa> => {
  //   //pega tarefa da tarefa
  //   this._tarefaService.get(tarefa.tarefaId)
  //     .subscribe((tarefa: Tarefa) => {

  //       const tarefaTarefa = { ...tarefa };

  //       if (!tarefaTarefa.tarefas)
  //         tarefaTarefa.tarefas = new Array<Tarefa>();

  //       //adiciona mais uma tarefa a tarefa e atualiza
  //       tarefaTarefa.tarefas.push(tarefa);

  //       tarefaTarefa.tarefas = tarefaTarefa.tarefas.slice();

  //       return tarefaTarefa;

  //     }, () => {
  //       return EMPTY;
  //     });

  //   return EMPTY;
  // }

  // update = (tarefa: Tarefa): Observable<Tarefa> => {
  //   this._tarefaService.get(tarefa.tarefaId)
  //     .subscribe(tarefaTarefa => {

  //       //pega index da tarefa pelo id
  //       const idx = tarefaTarefa.tarefas.findIndex((tare: Tarefa) => tare.id == tarefa.id);

  //       if (idx >= 0) {
  //         //atualiza tarefa pelo index
  //         tarefaTarefa.tarefas[idx] = tarefa;
  //         return this._tarefaService.update(tarefaTarefa);

  //       } else {

  //         return EMPTY;
  //       }

  //     }, () => {
  //       return EMPTY;
  //     });

  //   return EMPTY;
  // }

  // delete = (tarefa: Tarefa): Observable<any> => {
  //   this._tarefaService.get(tarefa.tarefaId)
  //     .subscribe(tarefaTarefa => {

  //       //pega index da tarefa pelo id
  //       const idx = tarefaTarefa.tarefas.findIndex((tare: Tarefa) => tare.id == tarefa.id);

  //       if (idx >= 0) {
  //         //atualiza tarefa pelo index
  //         tarefaTarefa.tarefas.splice(idx)

  //         return this._tarefaService.update(tarefaTarefa);

  //       } else {

  //         return EMPTY;
  //       }

  //     }, () => {
  //       return EMPTY;
  //     });

  //   return EMPTY;
  // }
}
