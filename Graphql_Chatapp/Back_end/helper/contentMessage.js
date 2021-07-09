require("dotenv/config");
const jwt = require("jsonwebtoken");
const { PubSub } = require("apollo-server");
const pubsub = new PubSub();

module.exports = (context) => {
  let token;
  if (context.req && context.req.headers.auth) {
    token = context.req.headers.auth.split("Bearer ")[1];
  } else if (context.connection && context.connection.context.auth) {
    token = context.connection.context.auth.split("Bearer ")[1];
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedtoken) => {
      context.user = decodedtoken;
    });
  }
  context.pubsub = pubsub;
  return context;
};
