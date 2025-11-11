const express = require("express");
const { ApolloServer, ApolloError } = require("apollo-server-express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const typeDefs = require("./schema/typeDefs");
const resolvers = require("./resolvers");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log("MongoDB connected"))
  .catch(err=>console.error("MongoDB error", err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    if (token) {
      try {
        const payload = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
        return { user: payload };
      } catch (e) {
        // invalid token - return empty context
        return {};
      }
    }
    return {};
  },
  formatError: (err) => {
    // avoid exposing stacktrace in production
    return err;
  }
});

(async () => {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
  const port = process.env.PORT || 5001;
  app.listen(port, () => console.log(`Server running: http://localhost:${port}${server.graphqlPath}`));
})();
