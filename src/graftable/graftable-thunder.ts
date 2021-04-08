import { Thunder } from "./graphql-zeus";
import { graphqlOperate } from "./graftable-operate";
import { createPostGraphileSchema } from "postgraphile";
import { databaseSchema, postgraphileOptions } from "./graftable-config";
import { pgPool } from "./graftable-pgpool";

const postgraphileSchemaPromise = createPostGraphileSchema(
  pgPool,
  databaseSchema,
  postgraphileOptions
);

const graphqlThunder = Thunder(
  async (query) => {
    const schema = await postgraphileSchemaPromise;
    const { data, errors } = await graphqlOperate(schema, query);
    if (errors?.length) {
      throw errors;
    }
    return data;
  }
);

export { graphqlThunder };
