const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize");
const router = require("express").Router();
const { UserModel } = require("../models");

function generateToken(User) {
  return jwt.sign(
    {
      id: User.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 60 * 60 * 24,
    }
  );
}

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const registerQuery = {
    username,
    passwordhash: bcrypt.hashSync(password, 13),
  };

  try {
    let newUser = await UserModel.create(registerQuery);
    let token = generateToken(newUser);

    res.status(201).json({
      message: "Account succesfully created.",
      user: newUser,
      token,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "That username is already in use.",
      });
    } else {
      console.log(error);
      res.status(500).json({
        message: "There was an issue creating an account.",
      });
    }
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    let foundUser = await UserModel.findOne({
      where: {
        username,
      },
    });

    if (foundUser && bcrypt.compareSync(password, foundUser.passwordhash)) {
      let token = generateToken(foundUser);

      res.status(200).json({
        message: "User succesfully logged in.",
        user: foundUser,
        sessionToken: token,
      });
    } else {
      res.status(401).json({
        message: "The provided username or password was not valid.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "The provided username or password was not valid.",
    });
  }
});

module.exports = router;
