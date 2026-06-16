import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./db/sequelize";
import userRouter from "./db/users/userRouter";
import noteRouter from "./db/notes/noteRouter";
import rateLimit from "express-rate-limit";
import { Reset, Root } from "./db/appController";

dotenv.config();

const PORT = parseInt(process.env.SERVER_PORT) || 3000;
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 100, // 100 requests per window
  message: "Spam detected, try again later"
});

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
  origin: "*",
  optionsSuccessStatus: 200
}));
app.use(limiter);

app.use("/users", userRouter);
app.use("/notes", noteRouter);

app.get("/", Root);
app.delete("/reset", Reset);

(async() => {
    await sequelize.sync({ alter: true });
    
    app.listen(PORT, () => {
        console.log(`Bedrock running at http://localhost:${PORT}`);
    });
})();