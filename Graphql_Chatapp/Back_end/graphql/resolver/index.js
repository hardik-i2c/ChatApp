const userResolver = require("./users");
const messagesResolver = require("./messages");

module.exports = {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Query: {
    ...userResolver.Query,
    ...messagesResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...messagesResolver.Mutation,
  },
  Subscription: {
    ...userResolver.Subscription,
    ...messagesResolver.Subscription,
  },
};
