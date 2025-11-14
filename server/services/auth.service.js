
import { collectionPokemonName } from "../utils/wideVariables.js";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
export async function findAndDeleteCardRecordsFromUser(userObjectId,collectionUsers){
    // search for cardsForTrade from user in array
    
    let result = await collectionUsers.findOne(userObjectId);
    let allCardTradeIds = result.cardTrades.cardsForTrade;
    let currentUserId = result._id.toString() 
// find card entries in records collection
const cardCollection =await db.collection(collectionPokemonName);
// this will get the id to search for
let cardSearch = allCardTradeIds[0].id;
// retrieve the card object from records
let currentCardDbObject = await cardCollection.findOne({id:cardSearch});
// console.log(currentCardDbObject)
// console.log(currentCardDbObject)
let filteredCardPoolWithoutPlayersCards = currentCardDbObject.tradeUsers;

// ! filter all cards which have the playerid into a var
let cardsWithPlayerInputs =await cardCollection.find( 
    {[`tradeUsers.${currentUserId}`] : {$exists:true} }


).toArray();
// console.log(cardsWithPlayerInputs[0].tradeUsers[currentUserId])

// ! create a for loop through each card returned

// ! count the amount the player owns in each card into a var
let finalCardCount = 0;
for (const [key, value] of Object.entries(cardsWithPlayerInputs[0].tradeUsers[currentUserId])) {
    finalCardCount += value
//   console.log(`${key}: ${value}`);

}
let currentCardPoolInDb = parseInt(cardsWithPlayerInputs[0].availableCards) - finalCardCount; 

console.log(currentCardPoolInDb)
// ! remove the entries from the card, and update availableCards number
let cardPoolWithCards = await cardCollection.updateMany(
    {},
  {
    $set: {
      
      availableCards: 0
    }
  }
);
// let cardPoolWithCards = await cardCollection.updateMany(
//     {[`tradeUsers.${currentUserId}`] : {$exists:true} },
//   {
//     $set: {
      
//       availableCards: currentCardPoolInDb
//     }
//   ,
  
//     $unset:
//     {
//         [`tradeUsers.${currentUserId}`]: ""  
//     }
//   }
// );


// const filteredTradeUsers = Object.fromEntries(
//   Object.entries(filteredCardPoolWithoutPlayersCards).filter(
//     ([key, value]) => key !== userObjectId
//   )
// );

// console.log(filteredTradeUsers); // → {}

// remove them
// await cardCollection.updateOne(
//           { _id: currentCardDbObject._id },
//           { $push: { [targetPath]: { id: cardId, language: lang, quantity: delta, owner: ownerId } } }
//         );
}