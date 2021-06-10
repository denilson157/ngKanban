import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ListaService } from 'src/app/service/lista.service';
import { Lista } from 'src/app/model/lista';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditarTarefaComponent } from '../dialogs/editar-tarefa/editar-tarefa.component';
import { Tarefa } from 'src/app/model/tarefa';
import { Categoria } from 'src/app/model/categoria';
import { CategoriaService } from 'src/app/service/categoria.service';
import { TarefaService } from 'src/app/service/tarefa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  listas = new Array<Lista>();
  categorias = new Array<Categoria>();

  tamanho = 0;

  constructor(private listaService: ListaService, private snackBar: MatSnackBar, private dialog: MatDialog, private categoriaService: CategoriaService, private tarefaService: TarefaService) { }

  ngOnInit(): void {
    this.list();
    this.listarCategorias();
  }

  private listarCategorias(): void {
    this.categoriaService.list()
      .subscribe(
        resp => this.categorias = resp,
        error => this.handleServiceError(error as HttpErrorResponse)
      );
  }

  list(): void {

    this.listaService.list()
      .subscribe(
        (listas: Array<Lista>) => {
          this.tamanho = 100 / listas.length;

          this.tarefaService.list()
            .subscribe((tarefas: Array<Tarefa>) => {
              const listaAtualizar = listas;

              listaAtualizar.forEach(lista => {
                lista.tarefas = tarefas.filter(x => x.listaId === lista.id);
              });

              this.listas = listaAtualizar;

            }, error => this.handleServiceError(error as HttpErrorResponse));

        }, error => this.handleServiceError(error as HttpErrorResponse)

      );


  }

  novaTarefa = (listaId?: number) => {

    if (listaId) {

      const tarefa = new Tarefa(listaId, '');

      const dialogResult = this.dialog.open(EditarTarefaComponent, {
        data: {
          tarefa: tarefa,
          categorias: this.categorias
        }
      });

      dialogResult.afterClosed().subscribe(() => this.list())
    }

  }

  editarTarefa = (tarefa: Tarefa) => {

    const dialogResult = this.dialog.open(EditarTarefaComponent, {
      data: {
        tarefa: tarefa,
        categorias: this.categorias
      }
    });

    dialogResult.afterClosed().subscribe(() => this.list())

  }

  private handleServiceError(error: HttpErrorResponse): void {
    this.showSnackbar(error.statusText);
  }

  private showSnackbar(msg: string): void {
    this.snackBar.open(msg, '', { duration: 3000 });
  }
}
