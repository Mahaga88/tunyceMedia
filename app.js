const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");

mongoose
  .connect("mongodb://localhost:27017/authDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION SUCCESSFUL!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "notagoodsecret", resave: false, saveUninitialized: false })
);

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  }
  next();
};

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/", (req, res) => {
  const links = `<a href="/login">Login</a> | <a href="/signup">Sign Up</a>`;
  res.send(`Welcome to the Home Page<br>${links}`);
});

app.post("/signup", async (req, res) => {
  const { password, username } = req.body;
  const user = new User({ username, password });
  await user.save();
  req.session.user_id = user._id;
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
      req.session.user_id = foundUser._id;
      res.redirect("/secret");
    } else {
      res.render("login", {
        errorMessage: "Invalid username or password",
        showLoginButton: true,
      });
    }
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.post("/logout", (req, res) => {
  // req.session.user_id = null;
  req.session.destroy();
  res.redirect("/login");
});

app.get("/secret", requireLogin, (req, res) => {
  res.render("secret");
});

app.get("/topsecret", requireLogin, (req, res) => {
  res.send("You found mySecret!");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(3000, () => {
  console.log("Serving app from PORT:3000");
});
