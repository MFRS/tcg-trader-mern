import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import records from "./routes/records.js";

const PORT = process.env.PORT || 5050;
const app = express();




app.use(cors());
app.use(express.json());;
app.use("/record", records);

//start Express server
app.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`);
});