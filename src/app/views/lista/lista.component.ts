import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Lista } from 'src/app/model/lista';
import { Tarefa } from 'src/app/model/tarefa';
import { ListaService } from 'src/app/service/lista.service';
import { ConfirmComponent } from '../dialogs/confirm/confirm.component';
import { ConfirmationVO } from '../dialogs/confirm/confirmation-vo';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})

export class ListaComponent implements OnInit {

  listas = new Array<Lista>();
  columns = ['nome', 'actions'];

  selectedLista?: Lista = undefined;

  constructor(private listaService: ListaService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.list();
  }

  showSnackbar(msg: string): void {
    this.snackBar.open(msg, '', { duration: 3000 });
  }

  list(): void {
    this.listaService.list()
      .subscribe(
        resp => this.listas = resp,
        error => this.handleServiceError(error as HttpErrorResponse)
      );
  }

  select = (lista: Lista) => {
    this.selectedLista = { ...lista };
  }

  cancel = () => {
    this.selectedLista = undefined;
  }

  save = () => {
    if (this.selectedLista && !this.selectedLista.id) {
      this.insert();
    }
    else {
      this.update();
    }

  }

  confirmDelete = (removeId?: number) => {
    const dialogResult = this.dialog.open(ConfirmComponent, {
      width: '300px',
      data: {
        id: removeId,
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

  private delete = (id: number) => {
    if (id) {

      this.listaService.delete(id)
        .subscribe(
          () => {
            this.list();
            this.cancel();
            this.showSnackbar('Lista excluída');
          },
          error => this.handleServiceError(error as HttpErrorResponse)
        )
    }
  }

  private update() {
    if (this.selectedLista) {
      this.listaService.update(this.selectedLista)
        .subscribe(() => {
          this.list();
          this.cancel();
          this.showSnackbar('Lista atualizada');
        }, error => this.handleServiceError(error as HttpErrorResponse));
    }
  }

  private insert() {
    if (this.selectedLista) {
      this.listaService.insert(this.selectedLista)
        .subscribe(() => {
          this.list();
          this.cancel();
          this.showSnackbar('Lista inserida');
        }, error => this.handleServiceError(error as HttpErrorResponse));
    }
  }

  private handleServiceError(error: HttpErrorResponse): void {
    console.log(error);
    this.showSnackbar(error.statusText);
  }

  create = () => {
    this.selectedLista = {
      id: undefined,
      nome: '',
      tarefas: new Array<Tarefa>()
    };
  }

}
