import express from "express";
import "reflect-metadata";
import { createConnection, getManager } from "typeorm";
import entities from "./entity";
import User from "./entity/User";

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

app.get("/", async (req, res) => {
  const userRepository = getManager().getRepository(User);
  const user = new User();
  user.name = "ndaemy";
  user.email = "yuyaebean@gmail.com";
  user.password = "1234";
  user.isEmailConfirmed = false;
  await userRepository.save(user);
  res.send("Hello, Express");
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log("🚀 Server is running on http://localhost:3000");
});
