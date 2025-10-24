import express, { response } from "express";
import cors from "cors";
import records from "./routes/records.js";
// Import the SDK in ESM/TypeScript
import TCGdex from '@tcgdex/sdk'
import fs from "fs";

// Instantiate the SDK with your preferred language
const tcgdex = new TCGdex('en');

const PORT = process.env.PORT || 5050;
const app = express();




app.use(cors());
app.use(express.json());;

// Force fresh responses — prevents browsers/CDN from caching old data
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});




// find 

async function getNamesOfAllSets(){
  const allInfo = await tcgdex.fetchSets('tcgp');
  // console.log(allInfo)
  // const {setNames} = await allInfo.json();
  // fs.writeFileSync("tcg-pocket-sets.json", JSON.stringify(allInfo, null, 2), "utf8");
  return allInfo;
}

async function getNamesOfAllCardsOfAllSets(){
  const allSets = await getNamesOfAllSets();
  const ids = allSets.map(set => set.id);
  // remove P-A
  const filterId = ids.filter(set => set != "P-A") 
  console.log(filterId)
  // will store all cards from loop
  const allCards = []
  let setNo = 5
  // let currentSetCards = await tcgdex.fetchCards(allSets[setNo]);
  // fs.writeFileSync("set"+setNo+".json", JSON.stringify(currentSetCards, null, 2), "utf8");
  
  for(let i=0;i<filterId.length; i++){
    let currentSetCards = await tcgdex.fetchCards(filterId[i]);
    allCards.push(currentSetCards);
  }
  // console.log(allCards.length)
  fs.writeFileSync("tcg-pocket-cards.json", JSON.stringify(allCards, null, 2), "utf8");
  return allCards;
}
// getNamesOfAllSets();

async function addExtraFieldsToEachPokemonCard(){
  const allCardsAllSets = await getNamesOfAllCardsOfAllSets();
  const allSetsInfo = await getNamesOfAllSets();

  let newDisplayName = `allCardsAllSets[0].name` + allSetsInfo[2].name
}



// // Use in an async context
// (async () => {
//   // Retrieve Furret from the Darkness Ablaze Set
//   // const card = await tcgdex.card.get('swsh3-136');
//   const card = await fetch('https://api.tcgdex.net/v2/en/sets/A1');
//   const {cards} = await card.json();
//   console.log(cards); // "Furret"
// })();