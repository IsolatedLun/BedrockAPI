import { Router } from "express";

const userRouter = Router();

userRouter.post("/register", (req, res) => {
    return res.status(200).send(`<h2>register</h2><p>${JSON.stringify(req.body)}<p>`);
});

export default userRouter;