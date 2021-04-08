import { createPostGraphileSchema } from 'postgraphile';
import exportPostGraphileSchema from 'postgraphile/build/postgraphile/schema/exportPostGraphileSchema.js';
import { databaseSchema, graphqlFile, postgraphileOptions } from './graftable-config';
import { pgPool } from './graftable-pgpool';

const postgraphileSchemaPromise = createPostGraphileSchema(pgPool, databaseSchema, postgraphileOptions);

(async () => {
  const schema = await postgraphileSchemaPromise;
  await exportPostGraphileSchema(schema, { exportGqlSchemaPath: graphqlFile });
})();
