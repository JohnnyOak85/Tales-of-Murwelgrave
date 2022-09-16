import { CollectionFactory as Collection } from '../tools/collection.factory';

const battles = new Collection<{
    challenger: string;
    defender: string;
    accepted: boolean;
}>();

const findBattle = (id: string) =>
    battles.getList().find(battle => battle.challenger === id || battle.defender === id);

export const isBattling = (id: string) => findBattle(id)?.accepted;

export const addBattle = (challenger: string, defender: string) =>
    battles.addItem(Date.now().toString(), { challenger, defender, accepted: true });

export const deleteBattle = (id: string) => {
    const duel = findBattle(id);

    if (!duel) return;

    const duelId = battles.findId(duel);

    if (!duelId) return;

    battles.deleteItem(duelId);
};
