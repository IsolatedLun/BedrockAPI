import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./db/sequelize";
import userRouter from "./db/users/userRouter";
import noteRouter from "./db/notes/noteRouter";
import { User } from "./db/users/user";
import { Note } from "./db/notes/note";

dotenv.config();

const PORT = parseInt(process.env.SERVER_PORT) || 3000;

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
  origin: "*",
  optionsSuccessStatus: 200
}));

app.use("/users", userRouter);
app.use("/notes", noteRouter);

app.get("/", (req, res) => {
    return res.status(200).send("<h1>server works</h1>");
});

app.delete("/reset", async(req, res) => {
    await User.truncate();
    await Note.truncate();

    return res.status(200).send({ ok: true });
});

(async() => {
    await sequelize.sync({ alter: true });
    
    app.listen(PORT, () => {
        console.log(`Bedrock running at http://localhost:${PORT}`);
    });
})();