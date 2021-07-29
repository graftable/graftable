import { createPostGraphileSchema } from "postgraphile";
import { databaseSchema, postgraphileOptions } from "./graftable-config-server";
import { pgPool } from "./graftable-pgpool";

const schemaPromise = createPostGraphileSchema(pgPool, databaseSchema, postgraphileOptions);

export { schemaPromise };
