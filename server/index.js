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
  const MONGO_DB = process.env["MONGO_DB"] || "mongodb://127.0.0.1:32770/Pankona";
  const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true });
  const db = client.db();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const githubToken = req.headers.authorization
      const currentUser = await db.collection('users').findOne({ githubToken })
      return { db, currentUser }
    }});

  server.applyMiddleware({ app });

  app.get("/", (req, res) => res.end("Vim script"));
  app.get(`/playground`, expressPlayground({ endpoint: `/graphql` }));
  app.listen({ port: 4000 }, () =>
    console.log(
      `GraphQL Server running @ http://localhost:4000${server.graphqlPath}`
    )
  );
}

start();
