import mongoose from "mongoose";
import { databaseName, mongoDbConnString, serverPort } from "./config";
import app from "./server";

const setupServer = () => new Promise(async (resolve, reject) => {
    await mongoose.connect(mongoDbConnString, {
        dbName: databaseName
    });
    app.listen(serverPort, (err) => {
        if (err) return reject(err)
        resolve(`Server is running at port: ${serverPort}`)
    });
});

setupServer().then(console.log).catch(console.error);