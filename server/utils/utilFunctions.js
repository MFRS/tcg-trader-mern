import db from "../db/connection.js";
import { cardCollection, collectionPokemonName } from "./wideVariables.js";

export function formatDate(currentDate){
    // Source - https://stackoverflow.com/a
// Posted by Aelios, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-10, License - CC BY-SA 4.0

const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();
let hours = today.getHours();
let minutes = today.getMinutes();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

return  `${dd}/${mm}/${yyyy}`;


}
// Nuke option. used during development, don't use for anything else
export async function deleteAllCardsForTrade(){
// get all cards
const cardCollection = await db.collection(collectionPokemonName);
// find cards that have length in cardTrades more than 0
// delete them all
let cardPoolWithCards = await cardCollection.updateMany(
    {},
  {
    $set: {
      tradeUsers: {},
      availableCards: 0
    }
  }
);

}

export async function resetAvailableCards(){
 let cardPoolWithCards = await cardCollection.updateMany(
    {},
  {
    $set: {
      
      availableCards: 0
    }
  }
);

}