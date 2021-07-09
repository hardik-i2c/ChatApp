require("dotenv/config");
const { Message, User } = require("../../models");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = {
  // Get value
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        let users = await User.findAll({
          attributes: ["username", "imageUrl", "createdAt"],
          where: { username: { [Op.ne]: user.username } },
        });
        const allUserMessages = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.username }, { to: user.username }],
          },
          order: [["createdAt", "DESC"]],
        });
        users = users.map((otherUser) => {
          const latestMessage = allUserMessages.find((m) => {
            return m.from === otherUser.username || m.to === otherUser.username;
          });
          otherUser.latestMessage = latestMessage;
          return otherUser;
        });

        return users;
      } catch (error) {
        // console.log(error);
        throw error;
      }
    },
    login: async (_, args) => {
      let { username, password } = args;
      let errors = {};
      try {
        if (username.trim() == "") errors.username = "Please enter username.";
        if (password == "") errors.password = "Please enter password.";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad input", { errors });
        }
        const user = await User.findOne({ where: { username } });
        if (!user) {
          errors.username = "User not found.";
          throw new UserInputError("User not found", { errors });
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
          errors.password = "Password is incorret.";
          throw new UserInputError("Password is incorret ", { errors });
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET, {
          expiresIn: "12h",
        });
        user.token = token;
        // var data = user.createdAt,
        // data.getFullYear() + "/" + data.getDate() + "/" + data.getDay();
        return user;
      } catch (err) {
        // console.log(err);
        throw err;
      }
    },
  },
  // Add values
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, comfirmPassword } = args;
      let errors = {};
      var validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      try {
        //   Validate input data
        if (username.trim() == "") errors.username = "Username not be empty.";
        if (password.trim() == "") errors.password = "Password not be empty.";
        if (comfirmPassword.trim() == "")
          errors.comfirmPassword = "Comfirm password not be empty.";

        //   Match the password
        if (password !== comfirmPassword)
          errors.comfirmPassword = "Password must be match.";

        // Validate Email
        if (email.trim() == "") errors.email = "Email not be empty.";
        else if (!email.match(validRegex))
          errors.email = "Enter valid email address.";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("Bad input", { errors });
        }
        // Encrypt password
        password = await bcrypt.hash(password, 6);
        // create user
        const user = await User.create({
          username,
          email,
          password,
        });
        return user;
      } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach((e) => {
            errors[e.path] = `${e.path} is already taken.`;
          });
        }
        throw new UserInputError("Bad input", { errors });
      }
    },
  },
};

// if (Object.keys(errors).length > 0) {
// Email and password existnace
// const userByusername = await User.findOne({ where: { username } });
// const userByEmail = await User.findOne({ where: { email } });
// if (userByusername) errors.username = "Username is taken.";
// if (userByEmail) errors.email = "Email is taken.";
//   throw errors;
// }
