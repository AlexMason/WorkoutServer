require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./db");

const controllers = require("./controllers");

app.use(express.json());
app.use(require("./middleware/headers"));

//define app routes below this line
app.use("/log", controllers.Log);
app.use("/user", controllers.User);

db.authenticate()
  .then(() => {
    db.sync();
  })
  .then(() => {
    app.listen(process.env.APP_PORT, () => {
      console.log(
        `[SERVER-WorkoutLog] App is listening on ${process.env.APP_PORT}`
      );
    });
  });
