// 1. Require 'apollo-server'
const { ApolloServer } = require("apollo-server");

const typeDefs = ` 
    type Query { totalPhotos: Int! } 
    type Mutation { postPhoto(name: String! description: String): Boolean! }
`;
var photos = [];
const resolvers = {
  Query: { totalPhotos: () => photos.length },

  // Mutation and postPhoto resolver
  Mutation: {
    postPhoto(parent, args) {
      photos.push(args);
      return true;
    },
  },
};

// 2. Create a new instance of the server.
// 3. Send it an object with typeDefs (the schema) and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// 4. Call listen on the server to launch the web server
server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url} `));
