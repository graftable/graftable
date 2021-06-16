import { createPostGraphileSchema } from "postgraphile";
import { databaseSchema, postgraphileOptions } from "./graftable-config";
import { pgPool } from "./graftable-pgpool";

const postgraphileSchemaPromise = createPostGraphileSchema(pgPool, databaseSchema, postgraphileOptions);

export { postgraphileSchemaPromise };
