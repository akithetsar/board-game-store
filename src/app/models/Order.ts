import { GameModel } from "./games";

export class Order{
    items: GameModel[] = [];
    price = 0;
}