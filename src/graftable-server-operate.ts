import { graphql, GraphQLSchema, Source } from 'graphql';
import { withPostGraphileContext } from 'postgraphile';
import { pgPool } from './graftable-pgpool';

async function graphqlServerOperate(
  schema: GraphQLSchema,
  source: string | Source,
  rootValue?: any,
  variableValues?: any,
  operationName?: any
) {
  return await withPostGraphileContext(
    {
      pgPool
      // jwtToken: jwtToken,
      // jwtSecret: "...",
      // pgDefaultRole: "..."
    },
    async context => {
      // Execute your GraphQL query in this function with the provided
      // `context` object, which should NOT be used outside of this
      // function.
      return await graphql(
        schema, // The schema from `createPostGraphileSchema`
        source,
        rootValue,
        {
          ...context
          // TODO jwtClaims?
        }, // You can add more to context if you like
        variableValues,
        operationName
      );
    }
  );
}

export { graphqlServerOperate }
