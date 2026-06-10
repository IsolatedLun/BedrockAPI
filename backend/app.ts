import express from "express";
import morgan from "morgan";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(morgan("dev"));

app.get("/", (req, res) => {
    return res.status(200).send("<h1>wassup</h1>");
});

app.listen(PORT, () => {
    console.log(`Bedrock running at http://localhost:${PORT}`);
});