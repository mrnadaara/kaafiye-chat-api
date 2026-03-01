import express from "express"
import { rootRouter } from "./routes/root";
import { singleUserRouter } from "./routes/user";
import { chatRouter } from "./routes/chat";

const app = express();

app.use(express.json());
app.use("/user", singleUserRouter)
app.use("/user", chatRouter);
app.use("/", rootRouter);

export default app;