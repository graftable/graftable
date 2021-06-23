import { readFile as origReadFile, writeFile as origWriteFile } from 'fs';
import * as GQL from 'graphql';
import { graphql, GraphQLSchema, lexicographicSortSchema, printSchema } from 'graphql';
import { PostGraphileOptions } from 'postgraphile/build/interfaces';
import { promisify } from 'util';
import { graphqlFile } from './graftable-config';
import { postgraphileSchemaPromise } from './graftable-schema';

const introspectionQuery =
  typeof GQL.getIntrospectionQuery === 'function' ? GQL.getIntrospectionQuery() : (GQL as any).introspectionQuery;

const readFile = promisify(origReadFile);
const writeFile = promisify(origWriteFile);

async function writeFileIfDiffers(path: string, contents: string): Promise<void> {
  let oldContents: string | null = null;
  try {
    oldContents = await readFile(path, 'utf8');
  } catch (e) {
    /* noop */
  }
  if (oldContents !== contents) {
    await writeFile(path, contents);
  }
}

/**
 * Exports a PostGraphile schema by looking at a Postgres client.
 */
async function exportPostGraphileSchema(
  schemaOrPromise: GraphQLSchema | Promise<GraphQLSchema>,
  options: PostGraphileOptions = {}
): Promise<void> {
  const schema = await schemaOrPromise;
  const jsonPath = typeof options.exportJsonSchemaPath === 'string' ? options.exportJsonSchemaPath : null;
  const graphqlPath = typeof options.exportGqlSchemaPath === 'string' ? options.exportGqlSchemaPath : null;

  // Sort schema, if requested
  const finalSchema =
    options.sortExport && lexicographicSortSchema && (jsonPath || graphqlPath)
      ? lexicographicSortSchema(schema)
      : schema;

  // JSON version
  if (jsonPath) {
    const result = await graphql(finalSchema, introspectionQuery);
    await writeFileIfDiffers(jsonPath, JSON.stringify(result, null, 2));
  }

  // Schema language version
  const graphqlSchema =
    printSchema(finalSchema) +
    `
"""WORKAROUND Zeus problem by appending schema entry points for [query, mutation, supscriptions]. """
schema {
  query: Query,
  mutation: Mutation
}
`;
  if (graphqlPath) {
    await writeFileIfDiffers(graphqlPath, graphqlSchema);
  }
}

(async () => await exportPostGraphileSchema(await postgraphileSchemaPromise, { exportGqlSchemaPath: graphqlFile }))();
