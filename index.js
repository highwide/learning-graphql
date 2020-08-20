const { ApolloServer } = require(`apollo-server-express`);
const { MongoClient } = require(`mongodb`);
require(`dotenv`).config();
const express = require("express");
const expressPlayground = require(`graphql-playground-middleware-express`)
  .default;

const resolvers = require("./resolvers");
const { readFileSync } = require(`fs`);
const typeDefs = readFileSync(`./typeDefs.graphql`, `UTF-8`);

async function start() {
  const app = express();
  // run docker run -P mongo and check assigned port with docker ps
  const MONGO_DB = "mongodb://localhost:32768/Pankona";
  const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true });
  const db = client.db();
  const context = { db };

  const server = new ApolloServer({ typeDefs, resolvers, context });

  server.applyMiddleware({ app });

  app.get("/", (req, res) => res.end("Welcome"));
  app.get(`/playground`, expressPlayground({ endpoint: `/graphql` }));
  app.listen({ port: 4000 }, () =>
    console.log(
      `GraphQL Server running @ http://localhost:4000${server.graphqlPath}`
    )
  );
}

start();
