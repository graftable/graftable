import exportPostGraphileSchema from 'postgraphile/build/postgraphile/schema/exportPostGraphileSchema.js';
import { graphqlFile } from './graftable-config';
import { postgraphileSchemaPromise } from './graftable-schema';

(async () => {
  const schema = await postgraphileSchemaPromise;
  await exportPostGraphileSchema(schema, { exportGqlSchemaPath: graphqlFile });
})();
