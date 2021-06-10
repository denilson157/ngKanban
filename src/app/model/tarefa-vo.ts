import { Tarefa } from "./tarefa";

export class TarefaVO {
    save: boolean;
    listaId: number;
    tarefa: Tarefa

    constructor(save: boolean, tarefa: Tarefa, listaId: number) {
        this.save = save;
        this.tarefa = tarefa;
        this.listaId = listaId;
    }
}