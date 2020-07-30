const { ApolloServer } = require(`apollo-server`);

const typeDefs = `
  type Query {
    totalPhotos: Int!
    shuffledMembers: [String]!
  }

  type Mutation {
    postPhoto(name: String! description: String): Boolean!
  }
`;

let photos = [];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    shuffledMembers: () =>
      [
        "kachick",
        "pankona",
        "mtsmfm",
        "motorollerscalatron",
        "nkmrh",
        "mpls104",
        "ujihisa",
        "geckour",
        "farmanlab",
        "elliekwon",
        "highwide",
      ].sort(() => Math.random() - 0.5),
  },

  Mutation: {
    postPhoto(_, args) {
      photos.push(args);
      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
