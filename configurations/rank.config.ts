import { DataList } from "../helpers/interfaces";

export const ROLES = ['Warrior', 'Knight', 'Crusader', 'Techno Wizard', 'Technomancer', 'Death Zealot', 'Death Acolyte']

export const RANKS: DataList<string> = {
    warrior: 'Knight',
    knight: 'Crusader',
    techie: 'Techno Wizard',
    'techno wizard': 'Technomancer',
    'death zealot': 'Death Acolyte'
}
