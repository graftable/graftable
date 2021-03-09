import exportPostGraphileSchema from 'postgraphile/build/postgraphile/schema/exportPostGraphileSchema.js';
import { databaseSchema, pgPool, postgraphileOptions } from './graphql-config';
import { createPostGraphileSchema } from 'postgraphile';

const postgraphileSchemaPromise = createPostGraphileSchema(pgPool, databaseSchema, postgraphileOptions);

(async () => {
  const schema = await postgraphileSchemaPromise;
  await exportPostGraphileSchema(schema, { exportGqlSchemaPath: 'graphql/schema.graphql' });
})();

export {};
