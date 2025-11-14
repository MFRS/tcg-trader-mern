import db from "../db/connection.js";

export const collectionPokemonName = "records";
export const collectionUserAccounts = "accounts";
export const routerUserAccounts = "accounts";
export const routerCards = "cardsDeal";
export const cardCollection = await db.collection(collectionPokemonName);