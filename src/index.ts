import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import api from "./api";
import entities from "./entity";

(async () => {
  await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "hammer-password",
    database: "hammer_schema",
    entities,
    synchronize: true,
    logging: false,
  });
})();

const app = express();

app.use(express.json()); // to parse application/json
app.use("/api", api); // connect api routes

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log("🚀 Server is running on http://localhost:3000");
});
