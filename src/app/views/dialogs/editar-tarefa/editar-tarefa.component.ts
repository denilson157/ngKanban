import { Component, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TarefaService } from 'src/app/service/tarefa.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup } from '@angular/forms';
import { Tarefa } from 'src/app/model/tarefa';
import { ListaService } from 'src/app/service/lista.service';
import { Lista } from 'src/app/model/lista';
import { Categoria } from 'src/app/model/categoria';

@Component({
  selector: 'app-editar-tarefa',
  templateUrl: './editar-tarefa.component.html',
  styleUrls: ['./editar-tarefa.component.css']
})
export class EditarTarefaComponent {
  formTarefa?: FormGroup;
  categorias = new Array<Categoria>();

  constructor(public dialogRef: MatDialogRef<EditarTarefaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, private tarefaService: TarefaService, private snackBar: MatSnackBar, private listaService: ListaService) {
    this.createForm(data.tarefa);
    this.categorias = data.categorias;
    console.log(data);
  }

  createForm = (tarefa: Tarefa): void => {

    this.formTarefa = new FormGroup({
      nome: new FormControl(tarefa.nome),
      id: new FormControl(tarefa.id),
      listaId: new FormControl(tarefa.listaId),
      categoriaId: new FormControl(tarefa.categoriaId)
    });
  }

  create = (): void => {

  }

  showSnackbar(msg: string): void {
    this.snackBar.open(msg, '', { duration: 3000 });
  }

  cancel = () => {
  }

  save = () => {

    if (this.formTarefa) {

      const tarefa = this.formTarefa?.getRawValue() as Tarefa;

      if (tarefa.id)
        this.update(tarefa);
      else
        this.insert(tarefa);

    }
  }


  private insert = (tarefa: Tarefa): void => {
    this.listaService.list()
      .subscribe((listas: Array<Lista>) => {
        const lista = listas.find(l => l.id === tarefa.listaId);

        if (lista) {
          tarefa.id = this.getIdTarefa(listas);
          lista.tarefas.push(tarefa);

          this.listaService.update(lista)
            .subscribe(() => {
              this.dialogRef.close(this.data);
              this.showSnackbar('Lista atualizada');
            }, error => this.handleServiceError(error as HttpErrorResponse));

        }
      }, error => this.handleServiceError(error as HttpErrorResponse));
  }

  private update = (tarefa: Tarefa): void => {
    //listando todas as listas com suas tarefas
    this.listaService.list()
      .subscribe((listas: Array<Lista>) => {

        //selecionando lista da tarefa
        const lista = listas.find(l => l.id === tarefa.listaId);

        if (lista) {

          //pega index da tarefa pelo id
          const idx = lista.tarefas.findIndex((tare: Tarefa) => tare.id == tarefa.id);

          if (idx >= 0) {
            //atualiza tarefa pelo index
            lista.tarefas[idx] = tarefa;
            this.listaService.update(lista)
              .subscribe(() => {
                this.dialogRef.close(this.data);
                this.showSnackbar('Lista atualizada');
              }, error => this.handleServiceError(error as HttpErrorResponse));

          }


        }
      }, error => this.handleServiceError(error as HttpErrorResponse));

  }

  private handleServiceError = (error: HttpErrorResponse): void => {
    console.log(error);
    this.showSnackbar(error.statusText);
  }

  private getIdTarefa = (listas: Array<Lista>): number => {
    let tarefas = Array<Tarefa>();

    listas.forEach(l => {
      l.tarefas.forEach(t => {
        tarefas.push(t);
      })
    });

    const tarefasId = tarefas.filter(s => s.id).map(x => x.id ?? 0);

    let ultimoId = 0
    if (tarefasId.length > 0)
      ultimoId = tarefasId.reduce((p, c) => p > c ? p : c);

    return (ultimoId + 1);
  }

}
