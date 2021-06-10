import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ListaService } from 'src/app/service/lista.service';
import { Lista } from 'src/app/model/lista';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditarTarefaComponent } from '../dialogs/editar-tarefa/editar-tarefa.component';
import { TarefaVO } from 'src/app/model/tarefa-vo';
import { Tarefa } from 'src/app/model/tarefa';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  listas = new Array<Lista>();
  tamanho = 0;

  constructor(private listaService: ListaService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.list();

  }

  list(): void {
    this.listaService.list()
      .subscribe(
        resp => {

          this.listas = resp;
          this.tamanho = 100 / resp.length;
        },
        error => this.handleServiceError(error as HttpErrorResponse)
      );
  }

  novaTarefa = (listaId?: number) => {

    if (listaId) {

      const tarefa = new Tarefa(listaId, '');

      const dialogResult = this.dialog.open(EditarTarefaComponent, {
        data: {
          tarefa
        }
      });

      dialogResult.afterClosed().subscribe(() => this.list())
    }

  }

  private handleServiceError(error: HttpErrorResponse): void {
    this.showSnackbar(error.statusText);
  }

  private showSnackbar(msg: string): void {
    this.snackBar.open(msg, '', { duration: 3000 });
  }
}
