require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoSession = require("connect-mongodb-session")(session);
const cors = require("cors");
const helmet = require("helmet");
const PORT = process.env.PORT || 4000;
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

//session CONFIG
const store = new mongoSession({
  uri: process.env.DB_URL,
  collection: "sessions",
});

//middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    expires: new Date(Date.now() + 30 * 86400 * 1),
  })
);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);

//Connect to DB
(async function () {
  try {
    await mongoose.connect(process.env.DB_URL);
    return console.log(`Successfully connected to ${process.env.DB_URL}`);
  } catch (error) {
    console.log("Error connecting to database: ", error);
    return process.exit(1);
  }
})();

// routers
app.use("/admin", adminRoutes.router);
app.use("/", userRoutes.router);

app.listen(PORT, () => {
  console.log(`Your server started on port ${PORT}...`);
});
