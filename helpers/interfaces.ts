export interface DataList {
  [prop: string]: string;
}

export interface Duelist {
  attack: number;
  bestiary: string[];
  defense: number;
  id: string;
  health: number;
  level: number;
  losses?: number;
  luck: number;
  messages?: number;
  name: string;
  wins?: number;
}
