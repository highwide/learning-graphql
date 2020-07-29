const typeDefs= `
  type Query {
    totalPhotos: Int!
  }
`
const resolvers = {
  Query: {
    totalPhotos: () => 42
  }
}
