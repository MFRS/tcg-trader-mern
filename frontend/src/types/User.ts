export interface User {
  _id: string;
  name: string;
  lastLogIn: string;   // you may later change this to Date
  email: string;
  password: string;
  discordId:string;
  accounts: Accounts[];
  // for PokeCard getting infor on all cardsWanted
  cardsWanted?:CardTradeEntry[];
  
}

export interface Accounts {
  
  tcgIdNo: string;
  tcgIdName: string;
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