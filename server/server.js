import express from "express";
import cors from "cors";
import records from "./routes/records.js";


const PORT = process.env.PORT || 5050;
const app = express();




app.use(cors());
app.use(express.json());;

// Force fresh responses — prevents browsers/CDN from caching old data
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});



app.use("/record", records);

//start Express server
app.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`);
});