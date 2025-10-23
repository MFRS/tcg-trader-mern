import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import records from "./routes/records.js";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}

const PORT = process.env.PORT || 5050;
const app = express();




app.use(cors());
app.use(express.json());;
app.use("/record", records);

//start Express server
app.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`);
});