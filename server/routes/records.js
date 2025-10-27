import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

const collectionPokemonName = "records"
const collectionUserAccounts = "accounts"
// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

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

// router.post("/accounts",async (req))

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

    let collection = await db.collection(collectionPokemonName);
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
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