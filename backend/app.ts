import express from "express";
import morgan from "morgan";
import { sequelize } from "./db/sequelize";
import userRouter from "./db/users/userRouter";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", userRouter);

app.get("/", (req, res) => {
    return res.status(200).send("<h1>wassup67</h1>");
});

(async() => {
    await sequelize.sync({ alter: true });
    
    app.listen(PORT, () => {
        console.log(`Bedrock running at http://localhost:${PORT}`);
    });
})();