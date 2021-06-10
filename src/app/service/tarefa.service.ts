import { Injectable } from '@angular/core';
import { ListaService } from './lista.service';
import { EMPTY, Observable } from 'rxjs';
import { Tarefa } from '../model/tarefa';
import { Lista } from '../model/lista';


@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  constructor(private _listaService: ListaService) { }


  insert = (tarefa: Tarefa): Observable<Lista> => {
    //pega lista da tarefa
    this._listaService.get(tarefa.listaId)
      .subscribe((lista: Lista) => {

        const listaTarefa = { ...lista };

        if (!listaTarefa.tarefas)
          listaTarefa.tarefas = new Array<Tarefa>();

        //adiciona mais uma tarefa a lista e atualiza
        listaTarefa.tarefas.push(tarefa);

        listaTarefa.tarefas = listaTarefa.tarefas.slice();

        return listaTarefa;

      }, () => {
        return EMPTY;
      });

    return EMPTY;
  }

  update = (tarefa: Tarefa): Observable<Lista> => {
    this._listaService.get(tarefa.listaId)
      .subscribe(listaTarefa => {

        //pega index da tarefa pelo id
        const idx = listaTarefa.tarefas.findIndex((tare: Tarefa) => tare.id == tarefa.id);

        if (idx >= 0) {
          //atualiza tarefa pelo index
          listaTarefa.tarefas[idx] = tarefa;
          return this._listaService.update(listaTarefa);

        } else {

          return EMPTY;
        }

      }, () => {
        return EMPTY;
      });

    return EMPTY;
  }

  delete = (tarefa: Tarefa): Observable<any> => {
    this._listaService.get(tarefa.listaId)
      .subscribe(listaTarefa => {

        //pega index da tarefa pelo id
        const idx = listaTarefa.tarefas.findIndex((tare: Tarefa) => tare.id == tarefa.id);

        if (idx >= 0) {
          //atualiza tarefa pelo index
          listaTarefa.tarefas.splice(idx)

          return this._listaService.update(listaTarefa);

        } else {

          return EMPTY;
        }

      }, () => {
        return EMPTY;
      });

    return EMPTY;
  }
}
