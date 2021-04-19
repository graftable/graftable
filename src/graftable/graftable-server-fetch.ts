import { Source } from 'graphql';
import { createPostGraphileSchema } from "postgraphile";
import { databaseSchema, postgraphileOptions } from "./graftable-config";
import { graphqlServerOperate } from "./graftable-server-operate";
import { pgPool } from "./graftable-pgpool";

const postgraphileSchemaPromise = createPostGraphileSchema(
  pgPool,
  databaseSchema,
  postgraphileOptions
);

async function graphqlServerFetch(source: string | Source) {
  const schema = await postgraphileSchemaPromise;
  const { data, errors } = await graphqlServerOperate(schema, source);
  if (errors?.length) {
    throw errors;
  }
  return data;
}

export { graphqlServerFetch };
