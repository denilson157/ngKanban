import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categoria } from 'src/app/model/categoria';
import { CategoriaService } from 'src/app/service/categoria.service';
import { ConfirmComponent } from '../dialogs/confirm/confirm.component';
import { ConfirmationVO } from '../dialogs/confirm/confirmation-vo';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {


  categorias = new Array<Categoria>();
  columns = ['nome', 'actions'];

  selectedCategoria?: Categoria = undefined;
  constructor(private categoriaService: CategoriaService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.list();
  }

  showSnackbar(msg: string): void {
    this.snackBar.open(msg, '', { duration: 3000 });
  }

  list(): void {
    this.categoriaService.list()
      .subscribe(
        resp => this.categorias = resp,
        error => this.handleServiceError(error as HttpErrorResponse)
      );
  }

  select = (categoria: Categoria) => {
    this.selectedCategoria = { ...categoria };
  }

  cancel = () => {
    this.selectedCategoria = undefined;
  }

  save = () => {
    if (this.selectedCategoria && !this.selectedCategoria.id) {
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

      this.categoriaService.delete(id)
        .subscribe(
          () => {
            this.list();
            this.cancel();
            this.showSnackbar('Categoria excluída');
          },
          error => this.handleServiceError(error as HttpErrorResponse)
        )
    }
  }

  private update() {
    if (this.selectedCategoria) {
      this.categoriaService.update(this.selectedCategoria)
        .subscribe(() => {
          this.list();
          this.cancel();
          this.showSnackbar('Categoria atualizada');
        }, error => this.handleServiceError(error as HttpErrorResponse));
    }
  }

  private insert() {
    if (this.selectedCategoria) {
      this.categoriaService.insert(this.selectedCategoria)
        .subscribe(() => {
          this.list();
          this.cancel();
          this.showSnackbar('Categoria inserida');
        }, error => this.handleServiceError(error as HttpErrorResponse));
    }
  }

  private handleServiceError(error: HttpErrorResponse): void {
    console.log(error);
    this.showSnackbar(error.statusText);
  }

  create = () => {
    this.selectedCategoria = {
      id: undefined,
      nome: ''
    };
  }

}
