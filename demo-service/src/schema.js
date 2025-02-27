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
        logger.info('Requested greet for {name}', { name: args.name });
        return `Hello, ${args.name}!`;
      },
    },
  },
});
