import express from "express"
import { rootRouter } from "./routes/root";
import { singleUserRouter } from "./routes/user";

const app = express();

app.use(express.json());
app.use("/user", singleUserRouter)
app.use("/", rootRouter);

export default app;