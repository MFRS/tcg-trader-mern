export interface User {
  _id: string;
  name: string;
  lastLogIn: string;   // you may later change this to Date
  email: string;
  password: string;
  tcgIdNo: string;
  tcgIdName: string;
  // for PokeCard getting infor on all cardsWanted
  cardsWanted?:CardTradeEntry[];

  cardTrades: CardTrades;
}

export interface CardTrades {
  cardsWanted: CardTradeEntry[];
  cardsForTrade: CardTradeEntry[];
}

export interface CardTradeEntry {
  id: string;
  language: string;   // you can tighten this later to "en" | "es" | ...
  quantity: number;
  owner: string;      // user _id as string
}