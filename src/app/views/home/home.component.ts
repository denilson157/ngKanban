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
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  listas = new Array<Lista>();
  categorias = new Array<Categoria>();

  //lista de colunas que estão conectadas
  connectedTo: string[] = [];
  screenWidth = window.innerWidth;
  tamanho = 100;

  constructor(
    private listaService: ListaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private categoriaService: CategoriaService,
    private tarefaService: TarefaService) { }

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

          //calcula o tamanho por igual das colunas
          if (this.screenWidth > 700) {
            this.tamanho = 100 / listas.length;
          }

          this.tarefaService.list()
            .subscribe((tarefas: Array<Tarefa>) => {

              //apos consultar tarefa e lista, vou colocar as tarefas dentro das listas pelo id
              const listaAtualizar = listas;

              listaAtualizar.forEach((lista: Lista) => {
                //todas tarefas que tiverem o mesmo id do item

                if (lista.id)
                  this.connectedTo.push(lista.id.toString());

                lista.tarefas = tarefas.filter(x => x.listaId === lista.id);
              });

              this.listas = listaAtualizar;

            }, error => this.handleServiceError(error as HttpErrorResponse));

        }, error => this.handleServiceError(error as HttpErrorResponse)

      );
  }

  novaTarefa = (listaId?: number) => {

    if (listaId) {
      //cria um nova tarefa e passa como argumento para a modal.
      const tarefa = new Tarefa(listaId, '', '');

      this.abrirModalTarefa(tarefa);
    }

  }

  private abrirModalTarefa = (tarefa: Tarefa) => {
    const dialogResult = this.dialog.open(EditarTarefaComponent, {
      data: {
        tarefa: tarefa,
        categorias: this.categorias
      }
    });

    dialogResult.afterClosed().subscribe(() => this.list())
  }

  editarTarefa = (tarefa: Tarefa) => {
    //pega a tarefa a editar e passa como argumento para a modal
    this.abrirModalTarefa(tarefa);

  }

  private handleServiceError(error: HttpErrorResponse): void {
    this.showSnackbar(error.statusText);
  }

  private showSnackbar(msg: string): void {
    this.snackBar.open(msg, '', { duration: 3000 });
  }

  drop(event: CdkDragDrop<Tarefa[]>) {

    if (event.previousContainer === event.container) {
      //se o container de destino for o mesmo da origem, somente a posição das tarefas é trocada
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const tarefaAtualizar = this.getTarefa(event);
      //atualiza no banco a  tarefa na nova lista
      if (tarefaAtualizar)
        this.tarefaService.update(tarefaAtualizar)
          .subscribe(() => {
            this.showSnackbar("Tarefa atualizada");
          });

      //altera visualmente a troca das tarefas pelas listas
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

    }
  }

  private getTarefa = (event: CdkDragDrop<Tarefa[]>): Tarefa => {
    //tarefas da lista que teve item arrastado

    const tarefasPrevious = event.previousContainer.data;

    //achando tarefa pelo id
    const tarefaArrastada = tarefasPrevious[event.previousIndex];

    //atualizando o id da nova tarefa
    tarefaArrastada.listaId = parseInt(event.container.id);

    return tarefaArrastada;
  }
}
