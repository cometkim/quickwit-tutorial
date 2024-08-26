import { createSchema } from 'graphql-yoga';
import { getLogger } from '@logtape/logtape';

const logger = getLogger();

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      greet(name: String! = "World"): String!
    }
  `,
  resolvers: {
    Query: {
      greet: (_root, args) => {
        logger.debug `Greeting ${args.name}`;
        return `Hello, ${args.name}!`;
      },
    },
  },
});
