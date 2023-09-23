import resolvers from "./user";

const resolver = {
  Query: {
    ...resolvers.Query
  },
  Mutation: {
    ...resolvers.Mutation
  },
};

export default resolver
