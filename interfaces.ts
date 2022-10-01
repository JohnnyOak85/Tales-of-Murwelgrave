import { Message } from "discord.js";

type GameArea = Dictionary<number>;
export type GameAreas = Dictionary<GameArea[]>;

export interface GameConfig {
    attributes: string[];
    colors: string[];
    ranks: Dictionary<string>;
    variations: string[];
}

export interface Dictionary<T> {
    [x: string]: T;
}

export interface Fighter {
    attack: number;
    boost?: number;
    damage?: number;
    defense: number;
    health: number;
    id: string;
    level: number;
    luck: number;
    name: string;
}

export interface Player extends Fighter {
    achievements: string[];
    attributes: Dictionary<number>;
    bestiary: string[];
    losses: number;
    messages: number;
    rank: string;
    wins: number;
}

export interface Monster extends Fighter {
    color: string;
    rank: number;
}

export interface Command {
    description: string;
    execute: (message: Message) => void;
    name: string;
    usage: string;
}

export interface PlayerInfo {
    id: string;
    name: string;
    titles: string[];
}