const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    username: String!
    email: String
    createdAt: String!
    token: String
    imageUrl: String
    latestMessage: Message
  }
  type Message {
    uuid: String!
    content: String!
    to: String!
    from: String!
    createdAt: String!
  }
  # Querty type in graphql
  type Query {
    getUsers: [User]!
    login(username: String!, password: String!): User!
    getMessages(from: String!): [Message]!
  }
  # Mutation type in graphql
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      comfirmPassword: String!
    ): User!
    sendMessage(to: String!, content: String!): Message!
  }
  # Subscription type in graphql
  type Subscription {
    newMessage: Message!
  }
`;
