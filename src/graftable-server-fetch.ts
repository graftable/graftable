import { Source } from 'graphql';
import { schemaPromise } from "./graftable-schema";
import { graphqlServerOperate } from "./graftable-server-operate";

export default async function graphqlServerFetch(source: string | Source) {
  const schema = await schemaPromise;
  const { data, errors } = await graphqlServerOperate(schema, source);
  if (errors?.length) {
    throw errors;
  }
  return data;
}

export { graphqlServerFetch };
