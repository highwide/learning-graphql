const { ApolloServer, PubSub } = require("apollo-server-express");
const { MongoClient } = require(`mongodb`);
require(`dotenv`).config();
const express = require("express");
const expressPlayground = require(`graphql-playground-middleware-express`)
  .default;
const path = require('path');

const resolvers = require("./resolvers");
const { readFileSync } = require(`fs`);
const typeDefs = readFileSync(`./typeDefs.graphql`, `UTF-8`);

const { createServer } = require("http");

async function start() {
  const app = express();
  // run docker run -P mongo and check assigned port with docker ps
  const MONGO_DB =
    process.env["MONGO_DB"] || "mongodb://127.0.0.1:32768/Pankona";
  const client = await MongoClient.connect(MONGO_DB, {
    useNewUrlParser: true,
  });
  const db = client.db();

  const pubsub = new PubSub();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, connection }) => {
      const githubToken = req
        ? req.headers.authorization
        : connection.context.Authorization;
      const currentUser = await db.collection("users").findOne({ githubToken });
      return { db, currentUser, pubsub };
    },
  });

  server.applyMiddleware({ app });

  app.get("/", (req, res) => res.end("Vim script"));
  app.get(
    `/playground`,
    expressPlayground({
      endpoint: `/graphql`,
      subscriptionEndpoint: `ws://localhost:4000/graphql`,
    })
  );

  app.use(
    '/img/photos',
    express.static(path.join(__dirname, 'assets', 'photos'))
  )

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);
  httpServer.listen({ port: 4000 }, () =>
    console.log(`GraphQL Server running at localhost:4000${server.graphqlPath}`)
  );
}

start();
