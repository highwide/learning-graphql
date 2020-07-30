const { ApolloServer } = require(`apollo-server`);

const typeDefs = `
  type Query {
    totalPhotos: Int!
    orderedMembers: [String]!
  }

  type Mutation {
    postPhoto(name: String! description: String): Boolean!
  }
`;

let photos = [];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    orderedMembers: () =>
      [
        "mtsmfm",
        "pankona",
        "mpls104",
        "kachick",
        "geckour",
        "highwide",
        "nkmrh",
        "motorollerscalatron",
        "farmanlab",
        "elliekwon",
        "ujihisa",
        "motoshima1150"
      ]
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
