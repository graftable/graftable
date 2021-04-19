import { Source } from 'graphql';
import { postgraphileSchemaPromise } from "./graftable-schema";
import { graphqlServerOperate } from "./graftable-server-operate";

async function graphqlServerFetch(source: string | Source) {
  const schema = await postgraphileSchemaPromise;
  const { data, errors } = await graphqlServerOperate(schema, source);
  if (errors?.length) {
    throw errors;
  }
  return data;
}

export { graphqlServerFetch };
