const { ApolloServer } = require(`apollo-server`);
const { GraphQLScalarType } = require('graphql');

const typeDefs = `
  scalar DateTime
  type Query {
    totalPhotos: Int!
    allPhotos(after: DateTime): [Photo!]!
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
    postedBy: User!
    taggedUsers: [User!]!
    created: DateTime!
  }

  type User {
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
    inPhotos: [Photo!]!
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

const serialize = value => new Date(value).toISOString()
const parseValue = value => new Date(value)

let users = [
  { "githubLogin": "mHattrup", "name": "Mike Hattrup" },
  { "githubLogin": "gPlake", "name": "Glen Plake" },
  { "githubLogin": "sSchmidt", "name": "Scot Schmidt" }
]

let _id = 0

let photos = [
  {
    "id": "1",
    "name": "Dropping the Heart Chute",
    "description": "The heart chute is one of my favorite chutes", "category": "ACTION",
    "githubUser": "gPlake"
  },
  {
    "id": "2",
    "name": "Enjoying the sunshine",
    "category": "SELFIE",
    "githubUser": "sSchmidt"
  },
  {
    "id": "3",
    "name": "Gunbarrel 25",
    "description": "25 laps on gunbarrel today", "category": "LANDSCAPE",
    "githubUser": "sSchmidt"
  }
]

var tags = [
  { "photoID": "1", "userID": "gPlake" },
  { "photoID": "2", "userID": "sSchmidt" },
  { "photoID": "2", "userID": "mHattrup" },
  { "photoID": "2", "userID": "gPlake" }
]

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: (parent, args) => { console.log(args) ;return photos },
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
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: parent => {
      return users.find(u => u.githubLogin === parent.githubUser)
    },
    taggedUsers: parent => tags
      .filter(tag => tag.photoID === parent.id)
      .map(tag => tag.userID)
      .map(userId => users.find(u => u.githubLogin === userId))
  },

  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubUser === parent.githubLogin)
    },
    inPhotos: parent => tags
      .filter(tag => tag.userID === parent.githubLogin)
      .map(tag => tag.photoID)
      .map(photoID => photos.find(p => p.id === photoID))
  },

  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value',
    parseValue,
    serialize,
    parseLiteral: ast => ast.value
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
