import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

const port = process.env.PORT || 4000;

// Connect to DB
connectDB();

const originAllowed=['http://localhost:5173']

app.use(express.json());
app.use(cors({origin:originAllowed, credentials: true }));
app.use(cookieParser());


// API Endpoint
app.get("/", (req, res) => {
  res.send("API working");
});

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)




app.listen(port, () => {
  console.log(`✅ Server is listening on port ${port}`);
});
