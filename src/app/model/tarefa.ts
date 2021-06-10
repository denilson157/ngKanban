export class Tarefa {
    id?: number;
    nome: string;
    descricao: string;
    listaId: number;
    categoriaId?: number;

    constructor(listaId: number, nome: string, descricao: string) {
        this.nome = nome;
        this.listaId = listaId;
        this.descricao = descricao;
    }
}
