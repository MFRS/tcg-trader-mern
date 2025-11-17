
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

// ! if there are no cards from user
if (!cardsWithPlayerInputs){
    return result.status(200).send({message:"no cards from user"})
}

// ! create a for loop through each card returned
for (let i=0;i<=cardsWithPlayerInputs.length-1;i++){
console.log(cardsWithPlayerInputs[i])


    // let currentCardId =  
// ! count the amount the player owns in each card into a var
let finalCardCount = 0;
for (const [key, value] of Object.entries(cardsWithPlayerInputs[i].tradeUsers[currentUserId])) {
    finalCardCount += value
//   console.log(`${key}: ${value}`);

}
let currentCardPoolInDb = parseInt(cardsWithPlayerInputs[i].availableCards) - finalCardCount; 

// ! deletes cards and sets available cards on this card
await cardCollection.updateOne(

{_id:cardsWithPlayerInputs[i]._id}

,

 {
    $set: {
      
      availableCards: currentCardPoolInDb
    }
  ,
  
    $unset:
    {
        [`tradeUsers.${currentUserId}`]: ""  
    }
  }


)


}

// ! deletes cards and sets available cards (this is only done once as it updates the whole database)
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



}