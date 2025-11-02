import express from "express";
import { ENV } from "./lib/env.js";
import cors from "cors";
import { connectDB } from "./lib/db.js";


const app = express();

//middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credential: true })); 



app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

const startServer = async()=>{
  try {
    await connectDB();
    app.listen(ENV.PORT,()=>console.log("Server is running on port:",ENV.PORT));
  } catch (error) {
    console.error("Error starting the server",error);
  }
}

startServer();