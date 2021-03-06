require("dotenv/config");
const { Message, User } = require("../../models");
const {
  UserInputError,
  AuthenticationError,
  withFilter,
} = require("apollo-server");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    getMessages: async (_, { from }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const otherUser = await User.findOne({ where: { username: from } });
        if (!otherUser) throw new UserInputError("User not exist.");
        const usernames = [user.username, otherUser.username];
        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          order: [["createdAt", "DESC"]],
        });
        return messages;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    sendMessage: async (_, { to, content }, { user, pubsub }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const recipient = await User.findOne({ where: { username: to } });
        if (!recipient) {
          throw new UserInputError("User not found.");
        } else if (recipient.username === user.username) {
          throw new UserInputError("You can't send message to your Self.");
        }
        if (content.trim() == "") {
          throw new UserInputError("Message is empty.");
        }
        const message = await Message.create({
          from: user.username,
          to,
          content,
        });
        pubsub.publish("NEW_MESSAGE", { newMessage: message });
        return message;
      } catch (error) {
        throw error;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator("NEW_MESSAGE");
        },
        ({ newMessage }, _, { user }) => {
          if (
            newMessage.from === user.username ||
            newMessage.to === user.username
          ) {
            return true;
          } else {
            return false;
          }
        }
      ),
    },
  },
};
