import dotenv from "dotenv";
import express, { response } from "express";
import cors from "cors";
import records from "./routes/records.js";
// Import the SDK in ESM/TypeScript
import TCGdex from '@tcgdex/sdk'
import fs from "fs";
import auth from "./routes/auth.js";
import { deleteAllCardsForTrade, resetAvailableCards } from "./utils/utilFunctions.js";

// Instantiate the SDK with your preferred language
const tcgdex = new TCGdex("en");
const PORT = process.env.PORT || 5050;
const app = express();
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}
// const getLocalizedCard = async (cardId) => {
  //   return await tcgdex.fetchCard(cardId);
  // };
  // console.log(await getLocalizedCard("A1-001"))
  
  // dotenv.config({ path: "./config.env" }); 
  // CORS Settings
  app.use(
    cors({
      origin:"http://localhost:5173",
      credentials:true,

    })
  );
  
  app.use(express.json({ limit: "50mb" }));                 // JSON
  app.use(express.urlencoded({ extended: true, limit: "50mb" })); // forms
  
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
  // getNamesOfAllSets()
  async function getNamesOfAllCardsOfAllSets(){
    const allSets = await getNamesOfAllSets();
    const ids = allSets.map(set => set.id);
    // remove P-A
    const filterId = ids.filter(set => set != "P-A") 
    // console.log(filterId)
    // will store all cards from loop
    const allCards = []
    let setNo = 5
    // let currentSetCards = await tcgdex.fetchCards(allSets[setNo]);
    // fs.writeFileSync("set"+setNo+".json", JSON.stringify(currentSetCards, null, 2), "utf8");
    
    for(let i=0;i<filterId.length; i++){
      let currentSetCards = await tcgdex.fetchCards(filterId[i]);
      allCards.push(currentSetCards);
    }
    // console.log(allCards.flat(Infinity).length)
    // console.log(allCards.length)
    fs.writeFileSync("tcg-pocket-cards2.json", JSON.stringify(allCards, null, 2), "utf8");
    return allCards.flat(Infinity);
  }
  // getNamesOfAllSets();
  
  async function addExtraFieldsToEachPokemonCard(){
    const allCardsAllSets = await getNamesOfAllCardsOfAllSets();
    
    const allSetsInfo = await getNamesOfAllSets();
    const filterPromo = allSetsInfo.filter(set => set.id != "P-A") 
    const newFilteredCards = [];
    // console.log(allCardsAllSets[500])
    for(let i=0;i<allCardsAllSets.length;i++){
      // console.log(allCardsAllSets[i])
      let currentCardSetInfo = await determineCardSet(allCardsAllSets[i],filterPromo) 
      let newDisplayName = `${allCardsAllSets[i].name} (${currentCardSetInfo[0].name}) (${currentCardSetInfo[0].id}) `
      let availableCards = 0;
      let tradeUsers = [];
      let cardNewFields = {
        newDisplayName,
        availableCards,
        tradeUsers,
        ...allCardsAllSets[i],
        
      }
      newFilteredCards.push(cardNewFields)
      
    }
    
    
    
    fs.writeFileSync("tcg-pocket-cards4.json", JSON.stringify(newFilteredCards, null, 2), "utf8");
    console.log(newFilteredCards)
  }
  
  async function determineCardSet(cardInfo,setInfo){
    
    // get first part of split in -
    // console.log(cardInfo)
    let cardSet = cardInfo.id.split("-")[0]
    let setname = setInfo.filter(set => set.id == cardSet);
    // console.log(setname[0].name)
    return setname;
  }
  
  
  // // Use in an async context
  // (async () => {
    //   // Retrieve Furret from the Darkness Ablaze Set
    //   // const card = await tcgdex.card.get('swsh3-136');
    //   const card = await fetch('https://api.tcgdex.net/v2/en/sets/A1');
    //   const {cards} = await card.json();
    //   console.log(cards); // "Furret"
    // })();


    
    app.use("/record", records);
    app.use("/auth", auth);
    
    //start Express server
    app.listen(PORT, ()=> {
      console.log(`Server listening on port ${PORT}`);
    });