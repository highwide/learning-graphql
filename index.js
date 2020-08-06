const { ApolloServer } = require(`apollo-server`);

const typeDefs = `
  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
    orderedMembers: [String]!
  }

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
  }

  input PostPhotoInput {
    name: String!
    category: PhotoCategory=PORTRAIT
    description: String
  }

  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
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
      let newPhoto = {
        id: _id++,
        ...args.input
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
