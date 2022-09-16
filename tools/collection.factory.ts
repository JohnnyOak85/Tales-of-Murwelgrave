import { Collection } from 'discord.js';

export class CollectionFactory<T> {
    private collection: Collection<string, T>;

    constructor() {
        this.collection = new Collection<string, T>();
    }

    public addItem = (name: string, item: T) => this.collection.set(name, item);
    public getItem = (name: string) => this.collection.get(name);
    public findItem = (name: string) => this.collection.has(name);
    public findId = (item: T) =>
        ([...this.collection.entries()].find(entry => entry[1] === item) || [undefined])[0];
    public deleteItem = (name: string) => this.collection.delete(name);
    public isSet = () => !!this.getList().length;
    public getList = () => [...this.collection.values()];
    public clearTimer = (name: string, timer: NodeJS.Timeout) => {
        clearTimeout(timer);
        this.deleteItem(name);
    };
}
