import { Message } from "discord.js";

type GameArea = Dictionary<number>;
export type GameAreas = Dictionary<GameArea[]>;
export type PlayerRanks = Dictionary<string>;

type RankColors = { [x: number]: string };
export interface GameConfig {
    variations: string[];
    colors: RankColors;
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
    rank: number;
}

export interface Player extends Fighter {
    achievements: string[];
    bestiary: string[];
    losses: number;
    messages: number;
    wins: number;
}

export interface Monster extends Fighter {
    color: string;
}

export interface Command {
    description: string;
    execute: (message: Message) => void;
    name: string;
    usage: string;
}