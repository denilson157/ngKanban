import { Tarefa } from "./tarefa";

export class Lista {
    id?: number;
    nome: string;
    tarefas: Array<Tarefa>;

    constructor(nome: string, tarefas: Array<Tarefa>) {
        this.nome = nome;
        this.tarefas = tarefas;
    }

}
