import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";
import { authJwt } from "../middleware/authJwt.js";
const collectionPokemonName = "records"
const collectionUserAccounts = "accounts"
const routerUserAccounts = "accounts";
const routerCards = "cardsDeal";
// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

router.get("/getAllUsers", async(req,res) => {
  let collection = await db.collection(collectionUserAccounts);
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
})
router.get("/getAllCards", async(req,res) => {
  let collection = await db.collection(collectionPokemonName);
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
})





// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection(collectionPokemonName);
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection(collectionPokemonName);
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

router.get(`/${routerUserAccounts}/:id`, async (req,res) => {
  let collection = await db.collection(collectionUserAccounts);
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if(!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let collection = await db.collection(collectionPokemonName);
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// Account creation

router.post(`/${routerUserAccounts}`,async (req,res) => {
  try{
    let newUser = {
      name: req.body.name,
      email:req.body.email,
      tcgIdNo:req.body.tcgIdNo,
      tcgIdName:req.body.tcgIdName,
      cardTrades:{
        cardsWanted:[],
        cardsForTrade:[],
      }
    };
    
    let collection = await db.collection(collectionUserAccounts);

    

    let result = await collection.insertOne(newUser);
    res.send(result).status(204);
  
  }catch(err){
    console.error(err);
    res.status(500).send("Error adding user");
  }
});

//get user

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// patch account and submit new cards

// takes an array with 

// [cardswanted(1card id, quantity, language)
//   cardsForTrade(1card id, quantity, language)

// ]

// routes/users.js (or wherever your user routes live)

// router.patch("/users/:userId/trades", (req, res) => {
/**
 * PATCH /record/accounts/:userId/cardsDeal
 * Body:
 * {
 *   "list": "cardsWanted" | "cardsForTrade",
 *   "card": { "language": "en", "id": "sv1-1" },
 *   "delta": 1 | -1 (integer, non-zero)
 * }
 *
 * Behavior:
 * - owner is taken from :userId (ignores any owner from client)
 * - if (id+language+owner) exists -> $inc quantity by delta
 * - if no match and delta > 0 -> push new entry with quantity=delta
 * - if no match and delta <= 0 -> 409 error
 * - does NOT auto-remove when quantity <= 0 (next step)
 */
// routes/users.js

/**
 * PATCH /record/accounts/:userId/cardsDeal
 * Body: {
 *   list: "cardsWanted" | "cardsForTrade",
 *   card: { language: "en"|"ja"|..., id: "sv1-1" },
 *   delta: integer (e.g. 1 or -1, non-zero)
 * }
 *
 * Rules added:
 * - Owner is :userId (ignore owner in body).
 * - If delta > 0 (adding) and the *other* list is empty, REFUSE (409).
 * - If matching (id+language+owner) exists → $inc quantity by delta.
 * - If no match and delta > 0 → $push new with quantity = delta.
 * - If no match and delta < 0 → 409 conflict.
 * - If delta < 0 and quantity drops to <= 0 → auto-remove that array entry.
 */

// ---- helpers ----
function hasItems(arr) {
  return Array.isArray(arr) && arr.length > 0;

}


// Resolve incoming cardIdRaw → logicalId ("A1-001")
// Accepts either "A1-001" or a 24-hex Mongo _id string from `records`


// at top: import { ObjectId } from "mongodb";

async function resolveLogicalCardId(db, cardIdRaw) {
  const raw = String(cardIdRaw || "").trim();
  if (!raw) return null;

  const recs = db.collection("records");
  const isHex24 = /^[0-9a-fA-F]{24}$/.test(raw);

  // a) If it looks like a Mongo _id, try both ObjectId and string _id
  if (isHex24) {
    // try as ObjectId(_id)
    try {
      const byObjId = await recs.findOne({ _id: new ObjectId(raw) }, { projection: { id: 1 } });
      if (byObjId?.id) return String(byObjId.id).trim();
    } catch (_) {
      /* ignore bad ObjectId */
    }
    // try as string _id
    const byStringId = await recs.findOne({ _id: raw }, { projection: { id: 1 } });
    if (byStringId?.id) return String(byStringId.id).trim();
  }

  // b) Otherwise, if caller already sent logical id, just return it
  //    Also cover case where caller sent hex but it actually lives in the 'id' field.
  const byLogical = await recs.findOne({ id: raw }, { projection: { id: 1 } });
  if (byLogical?.id) return String(byLogical.id).trim();

  // c) fall through
  return raw || null;
}


// Look up records by `id: <cardId>` instead of `_id`
async function syncRecordsDelta({ cardId, userId, lang, delta }) {
  const recs = db.collection("records");
  const userLangPath = `tradeUsers.${userId}.${lang}`;
  const selector = { id: cardId };

  console.log("[syncRecordsDelta] START", { cardId, userId, lang, delta });

  try {
    // 0) ensure base doc exists
    const setOnInsert = { id: cardId, availableCards: 0, tradeUsers: {} };
    const upsertRes = await recs.updateOne(selector, { $setOnInsert: setOnInsert }, { upsert: true });
    console.log("[syncRecordsDelta] ensure base doc", upsertRes);

    // 1) apply delta
    const incRes = await recs.updateOne(
      selector,
      { $inc: { availableCards: delta, [userLangPath]: delta } }
    );
    console.log("[syncRecordsDelta] incRes", incRes);

    // 2) cleanup
    const unsetRes = await recs.updateOne(
      { ...selector, [userLangPath]: { $lte: 0 } },
      { $unset: { [userLangPath]: "" } }
    );
    const floorRes = await recs.updateOne(
      { ...selector, availableCards: { $lt: 0 } },
      { $set: { availableCards: 0 } }
    );
    console.log("[syncRecordsDelta] cleanup", { unsetRes, floorRes });

    console.log("[syncRecordsDelta] DONE ✅");
  } catch (err) {
    console.error("[syncRecordsDelta] ERROR ❌", err);
  }
}

router.patch(`/${routerUserAccounts}/:userId/${routerCards}`,authJwt, async (req, res) => {
  
  let listName = req.body.list;
  let card = req.body.card;
  let delta = req.body.delta;
  let userId = req.params['userId'];
  console.log(req.user.id)
  if(req.user.id !== userId){
    res.status(403).json({message:"forbidden"})
  }
  else{
    let isActive = false;
    let allowedLists = ["cardsForTrade","cardsWanted"];
    // console.log(allowedLists.includes(listName))
    if (allowedLists.includes(listName)){
      if(typeof card == "object" && card.id && card.language){

        if(Number.isFinite(delta) && delta !==0){
         let user =await db.collection(collectionUserAccounts)
          .findOne({_id: new ObjectId(userId)})
          // user different than null
          if(user !== null){

            // if cards more than 0, then start counting them on the server for everyone
            let cardsWanted = user.cardTrades.cardsWanted;
            let cardsForTrade = user.cardTrades.cardsForTrade;
            
            if(cardsForTrade.length >0 && cardsWanted.length > 0){
              isActive = true ;
              // if()
              // console.log(`isactive? ${isActive} ${user.cardTrades.cardsForTrade.length} ${user.cardTrades.cardsWanted.length}`);
            }
            // modifying the user's cardTrades list
            let targetPath; 
            if(listName === cardsWanted){
              targetPath = cardsWanted;
            }else{
              targetPath = cardsForTrade;
            }
            let cardId = card.id.trim();
            let lang = card.language.trim();

            const submittingObject = {
              user:user,
              path:targetPath,
              card:{id:cardId,language:lang},
              delta:delta

            }
            console.log(`${JSON.stringify(submittingObject)}` )
            

            // res.status(200).json({message:"found user"})
            
          }else{
            res.status(400).json({message:"user not found"})

          }
          res.status(200).json({message:"card is good , delta is good"})
        }else{
          res.status(400).json({message:"bad delta"})

        }
        
        
      }else{
        res.status(400).json({message:"Bad card"})

      }

    } else{
      res.status(400).json({message:"wrong list name"})
    }

  }



  // console.log(`user ${userId} ${listName}, ${card} , ${delta}`)
  // if you don't send this, postman hangs

});





// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection(collectionPokemonName);
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

router.delete(`/${routerUserAccounts}/:id`, async(req,res) => {
  try{
    const query = { _id: new ObjectId(req.params.id) };
const collection = db.collection(collectionUserAccounts);
let result = await collection.deleteOne(query);

    res.send(result).status(200);
  
  }catch(err){
    console.error(err);
    res.status(500).send("Error del user");
  }
})


// --- Bulk insert (POST /record/bulk) ---
const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

router.post("/bulk", async (req, res) => {
  try {
    // Accept either an array or { items: [...] }
    const items = Array.isArray(req.body) ? req.body : req.body?.items;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Send an array or { items: [...] }" });
    }

    // Tune batch size to your workload; 500–1000 is a good start
    const batches = chunk(items, 1000);
    const collection = db.collection(collectionPokemonName);

    let inserted = 0;
    const errors = [];

    for (const batch of batches) {
      try {
        const result = await collection.insertMany(batch, { ordered: false });
        const count = result.insertedCount ?? Object.keys(result.insertedIds || {}).length;
        inserted += count;
      } catch (e) {
        // Keep going on per-doc errors (e.g., duplicate key) and collect messages
        errors.push({ batchSize: batch.length, message: e.message });
      }
    }

    // 207 = Multi-Status (some successes, some failures)
    return res.status(errors.length ? 207 : 200).json({
      ok: true,
      inserted,
      batches: batches.length,
      errors,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});
// --- end bulk route ---


export default router;