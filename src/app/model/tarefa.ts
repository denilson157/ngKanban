export class Tarefa {
    id?: number;
    nome: string;
    listaId: number;
    categoriaId?: number;

    constructor(listaId: number, nome: string) {
        this.nome = nome;
        this.listaId = listaId;
    }
}
