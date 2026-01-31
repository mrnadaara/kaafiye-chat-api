import { serverPort } from "./config";
import app from "./server";

app.listen(serverPort, () => {
    console.log(`Server is running at port: ${serverPort}`)
})