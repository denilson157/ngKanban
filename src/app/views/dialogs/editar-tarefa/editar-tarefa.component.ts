import { Component, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TarefaService } from 'src/app/service/tarefa.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup } from '@angular/forms';
import { Tarefa } from 'src/app/model/tarefa';
import { Categoria } from 'src/app/model/categoria';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ConfirmationVO } from '../confirm/confirmation-vo';

@Component({
  selector: 'app-editar-tarefa',
  templateUrl: './editar-tarefa.component.html',
  styleUrls: ['./editar-tarefa.component.css']
})

export class EditarTarefaComponent {
  formTarefa?: FormGroup;
  categorias = new Array<Categoria>();

  constructor(public dialogRef: MatDialogRef<EditarTarefaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, private tarefaService: TarefaService, private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.createForm(data.tarefa);
    this.categorias = data.categorias;
  }

  createForm = (tarefa: Tarefa): void => {

    this.formTarefa = new FormGroup({
      nome: new FormControl(tarefa.nome),
      id: new FormControl(tarefa.id),
      listaId: new FormControl(tarefa.listaId),
      categoriaId: new FormControl(tarefa.categoriaId)
    });
  }

  showSnackbar(msg: string): void {
    this.snackBar.open(msg, '', { duration: 3000 });
  }

  cancel = () => {
    this.dialogRef.close(this.data);
  }

  save = () => {

    const tarefa = this.getTarefa()
    if (tarefa) {
      if (tarefa.id)
        this.update(tarefa);
      else
        this.insert(tarefa);
    }
  }

  getTarefa = (): Tarefa | undefined => {
    if (this.formTarefa)
      return this.formTarefa?.getRawValue() as Tarefa;

    return;
  }

  private insert = (tarefa: Tarefa): void => {
    this.tarefaService.insert(tarefa)
      .subscribe(() => {
        this.dialogRef.close(this.data);
        this.showSnackbar('Tarefa inserida');
      }, error => this.handleServiceError(error as HttpErrorResponse));
  }

  private update = (tarefa: Tarefa): void => {
    this.tarefaService.update(tarefa)
      .subscribe(() => {
        this.dialogRef.close(this.data);
        this.showSnackbar(`Tarefa ${tarefa.id} atualizada`);
      }, error => this.handleServiceError(error as HttpErrorResponse));
  }

  private handleServiceError = (error: HttpErrorResponse): void => {
    console.log(error);
    this.showSnackbar(error.statusText);
  }

  confirmDelete = () => {

    const tarefa = this.getTarefa();

    if (tarefa) {

      const dialogResult = this.dialog.open(ConfirmComponent, {
        width: '300px',
        data: {
          id: tarefa.id,
          answer: false
        }
      });

      dialogResult.afterClosed()
        .subscribe((resp: ConfirmationVO) => {
          if (resp.answer && resp.id) {
            this.delete(resp.id);
          }
        })
    }

  }

  private delete = (id: number) => {
    if (id) {

      this.tarefaService.delete(id)
        .subscribe(
          () => {
            this.cancel();
            this.showSnackbar(`Tarefa ${id} excluída`);
          },
          error => this.handleServiceError(error as HttpErrorResponse)
        )
    }
  }

}
