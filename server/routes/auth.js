import express from "express";
import jwt from "jsonwebtoken";
import { secretFingerprint } from "../utils/secretFingerprint.js";
const router = express.Router();
import { authJwt } from "../middleware/authJwt.js";
// This will help us connect to the database
import db from "../db/connection.js";
import { formatDate } from "../utils/utilFunctions.js";
import { findAndDeleteCardRecordsFromUser } from "../services/auth.service.js";
import { collectionPokemonName,collectionUserAccounts,routerCards,routerUserAccounts } from "../utils/wideVariables.js";
import { ObjectId } from "mongodb";

// this is accessed by public to get cardsForTrade
router.get(`/${routerUserAccounts}/:id`, async (req, res) => {
  try {
    const collection = db.collection(collectionUserAccounts);
    const { id } = req.params;

    // 🔹 If your _id field in Mongo is an ObjectId, keep this:
    const query = { _id: new ObjectId(id) };

    // 🔹 If your _id is a STRING in the DB, use this instead:
    // const query = { _id: id };

    const result = await collection.findOne(query);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    const filteredPublicInfo = {
      playerId: result._id?.toString(),              // 👈 use result._id, not bare _id
      tcgIdNo: result.tcgIdNo,
      tcgIdName: result.tcgIdName,
      cardsWanted: result.cardTrades?.cardsWanted ?? [],
      lastLogin: result.lastLogIn
    };

    return res.status(200).json(filteredPublicInfo);
  } catch (err) {
    console.error("Error in GET /auth/accounts/:id:", err);
    return res.status(500).json({ message: "Server error" });
  }
});





router.post("/login",async (req, res) => {
  try{
    const {name, password} = req.body;

    const user = await db.collection(collectionUserAccounts).findOne({name});

    if(!user){
      return res.status(400).send("user not found")
    }
    // is password wrong?
    if(user.password !== password){
      return res.status(401).json({message:"Invalid password"})
    }else {
      // user can sign in
      // if so, proceed to auth
      const { _id } = user;
      if (!_id) return res.status(400).json({ code: "bad_user", message: "userId required" });
    
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ code: "server_misconfig", message: "JWT_SECRET missing" });
      }
      
      // update logged in time to current time
      // console.log(_id)
        const currentDate = formatDate(Date.now());
        const incResult = await db.collection(collectionUserAccounts).updateOne(
      { _id: _id },
      { $set: { lastLogIn: currentDate} },
    );


      // console.log(req.body.password)
    
      const token = jwt.sign(
        { sub: String(_id), aud: process.env.JWT_AUD, iss: process.env.JWT_ISS },
        process.env.JWT_SECRET,
        { algorithm: "HS256", expiresIn: "1h" }
      );
    
      res.json({
        ok: true,
        token,
        env: {
          iss: process.env.JWT_ISS,
          aud: process.env.JWT_AUD,
          secret_fp: secretFingerprint()
        }
      });
      
    }


}catch(err){
  console.error(err);
  return res.status(500).json({message:"Server error"});
}
});

router.get("/diag", (req, res) => {
  res.json({
    ok: true,
    env: {
      iss: process.env.JWT_ISS || null,
      aud: process.env.JWT_AUD || null,
      secret_fp: secretFingerprint(),
      secret_len: (process.env.JWT_SECRET || "").length
    },
    pid: process.pid
  });
});


// 🔓 LOGOUT route
router.post("/logout", authJwt, async (req, res) => {
  try {
    const token = req.user.token; // set in authJwt

    // store token in blacklist collection
    await db.collection("blacklistedTokens").insertOne({
      token,
      createdAt: new Date(),
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error in /logout:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// this route deletes an account
router.delete(`/${routerUserAccounts}/:id`,authJwt, async(req,res) => {
  try{

    const requestedId = req.params.id;    // ID in the URL
    const authenticatedId = req.user.id;  // ID from JWT (sub)
    // 1️⃣ Only allow user to delete their own account
    if (requestedId !== authenticatedId) {
      return res
        .status(403)
        .json({ code: "forbidden", message: "You can only delete your own account" });
    }

   
    const query = { _id: new ObjectId(req.params.id) };
const collection = db.collection(collectionUserAccounts);

// delete cards from user
findAndDeleteCardRecordsFromUser(query,collection)


// delete user
// let result = await collection.deleteOne(query);

    // res.send(result).status(200);
  res.send().status(200);
  }catch(err){
    console.error(err);
    res.status(500).send("Error del user");
  }
})




export default router;
