import { Component, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TarefaService } from 'src/app/service/tarefa.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup } from '@angular/forms';
import { Tarefa } from 'src/app/model/tarefa';
import { ListaService } from 'src/app/service/lista.service';
import { Lista } from 'src/app/model/lista';

@Component({
  selector: 'app-editar-tarefa',
  templateUrl: './editar-tarefa.component.html',
  styleUrls: ['./editar-tarefa.component.css']
})
export class EditarTarefaComponent {
  formTarefa?: FormGroup;

  constructor(public dialogRef: MatDialogRef<EditarTarefaComponent>,
    @Inject(MAT_DIALOG_DATA) private tarefa: any, private tarefaService: TarefaService, private snackBar: MatSnackBar, private listaService: ListaService) {
    this.createForm(tarefa.tarefa);
  }

  createForm = (tarefa: Tarefa): void => {

    this.formTarefa = new FormGroup({
      nome: new FormControl(tarefa.nome),
      id: new FormControl(tarefa.id),
      listaId: new FormControl(tarefa.listaId)
    });
  }

  create = (): void => {

  }

  showSnackbar(msg: string): void {
    this.snackBar.open(msg, '', { duration: 3000 });
  }

  cancel = () => {


    this.dialogRef.close(this.tarefa);
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
    this.tarefaService.insert(tarefa)
      .subscribe(() => {
        this.dialogRef.close(this.tarefa);
        this.showSnackbar('Lista atualizada');
      }, error => this.handleServiceError(error as HttpErrorResponse));

  }

  private update = (tarefa: Tarefa): void => {

    this.listaService.get(tarefa.listaId)
      .subscribe((lista: Lista) => {

        this.listaService.update(lista)
          .subscribe((updatedLista: Lista) => {
            this.dialogRef.close(this.tarefa);
            this.showSnackbar('Lista atualizada');
          }, error => this.handleServiceError(error as HttpErrorResponse));

      }, error => this.handleServiceError(error as HttpErrorResponse));


  }

  private handleServiceError = (error: HttpErrorResponse): void => {
    console.log(error);
    this.showSnackbar(error.statusText);
  }

}
