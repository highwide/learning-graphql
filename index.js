const { ApolloServer } = require(`apollo-server`);

const typeDefs = `
  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
    orderedMembers: [String]!
  }

  type Mutation {
    postPhoto(name: String! description: String): Photo!
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
  }
`;

let _id = 0
let photos = [];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
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
      var newPhoto = {
        id: _id++,
        ...args
      }
      photos.push(newPhoto);

      return newPhoto;
    },
  },

  Photo: {
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
