import { ApolloServer } from "apollo-server-express"
import mongoose from "mongoose"

import express from "express"
const app = express()

import typeDefs from './graphQL/typedef'
import resolvers from './graphQL/resolver'

const MONGODB = "mongodb://127.0.0.1:27017/GraphQL";
mongoose.connect(MONGODB);

const server = new ApolloServer({
  typeDefs,
  resolvers
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
};

startApolloServer().then(() => {
  // Start your Express.js server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
});

