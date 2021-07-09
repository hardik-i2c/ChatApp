const { ApolloServer } = require("apollo-server");

const { sequelize } = require("./models/index");

const resolvers = require("./graphql/resolver");
const typeDefs = require("./graphql/typeDefs");
const contentMiddlware = require("./helper/contentMessage");
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contentMiddlware,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);

  sequelize
    .authenticate()
    .then(() => {
      console.log("Connected with database!");
    })
    .catch((err) => {
      console.log(err);
    });
});
