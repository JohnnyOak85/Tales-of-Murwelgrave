export interface DataList<T> {
    [prop: string | number]: T;
}

export interface Duelist {
    attack: number;
    defense: number;
    id: string;
    health: number;
    level: number;
    luck: number;
    name: string;
}

export interface Player extends Duelist {
    bestiary: string[];
    losses: number;
    messages: number;
    wins: number;
}
