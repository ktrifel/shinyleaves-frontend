import { Injectable, signal, Signal } from '@angular/core';

/** Ein Eintrag im Warenkorb */
export interface CartItem {
  id:       number;      // eindeutige Produkt‑ID
  name:     string;
  price:    number;      // Einzelpreis
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  /** Interner Signal‑State */
  private readonly _items = signal<CartItem[]>([]);

  /** Public‑Getter – damit Components nur lesen können                */
  get items(): Signal<CartItem[]> { return this._items.asReadonly(); }

  /** Item hinzufügen (legt Eintrag an oder erhöht die Menge)          */
  add(item: CartItem) {
    const exists = this._items().find(i => i.id === item.id);
    if (exists) {
      exists.quantity += item.quantity;
      this._items.update(list => [...list]);
    } else {
      this._items.update(list => [...list, item]);
    }
  }

  /** Entfernt exakt EINE Einheit; löscht Eintrag wenn quantity==0     */
  removeOne(id: number) {
    this._items.update(list =>
      list.flatMap(i =>
        i.id === id
          ? (() => {
              const updatedItem = i.quantity > 1 ? [{ ...i, quantity: i.quantity - 1 }] : [];
              return updatedItem;
            })()
          : i
      )
    );
  }

  /** Kompletten Eintrag löschen                                       */
  removeItem(id: number) {
    this._items.update(list => list.filter(i => i.id !== id));
  }

  /** Warenkorb leeren                                                 */
  clear() { this._items.set([]); }

  /** Gesamtpreis als Zahl                                             */
  total(): number {
    return this._items().reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}
