import { GameModel } from './games';

export class Cart {
  items: GameModel[] = [];

  get total(): number {
    return this.items.reduce((sum, g) => sum + g.price, 0);
  }

  /** Remove one item by id */
  remove(id: string) {
    const idx = this.items.findIndex(g => g.id === id);
    if (idx !== -1) this.items.splice(idx, 1);
  }

  /** Count how many times a game appears */
  qty(id: string): number {
    return this.items.filter(g => g.id === id).length;
  }
}
