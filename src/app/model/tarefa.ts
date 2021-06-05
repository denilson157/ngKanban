export class Tarefa {
    id?: number;
    nome: string;
    listaId: number;

    constructor(nome: string, listaId: number) {
        this.nome = nome;
        this.listaId = listaId;
    }
}
