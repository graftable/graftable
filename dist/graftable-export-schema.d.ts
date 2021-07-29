import { GraphQLSchema } from 'graphql';
import { PostGraphileOptions } from 'postgraphile/build/interfaces';
/**
 * Exports a PostGraphile schema by looking at a Postgres client.
 */
export declare function exportSchema(schemaOrPromise?: GraphQLSchema | Promise<GraphQLSchema>, options?: PostGraphileOptions): Promise<void>;
