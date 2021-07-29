import { readFile as origReadFile, writeFile as origWriteFile } from 'fs';
import * as GQL from 'graphql';
import { graphql, GraphQLSchema, lexicographicSortSchema, printSchema } from 'graphql';
import { PostGraphileOptions } from 'postgraphile/build/interfaces';
import { promisify } from 'util';
import { graphqlFile } from './graftable-config-server';

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
export async function exportSchema(
  schemaOrPromise?: GraphQLSchema | Promise<GraphQLSchema>,
  options: PostGraphileOptions = { exportGqlSchemaPath: graphqlFile }
): Promise<void> {
  const jsonPath = typeof options.exportJsonSchemaPath === 'string' ? options.exportJsonSchemaPath : null;
  const graphqlPath = typeof options.exportGqlSchemaPath === 'string' ? options.exportGqlSchemaPath : null;

  const schema = schemaOrPromise || (await import('./graftable-schema')).schemaPromise;

  const configureSchema = async (s: GraphQLSchema | Promise<GraphQLSchema>) =>
    options.sortExport && lexicographicSortSchema ? lexicographicSortSchema(await s) : s;

  // JSON version
  if (jsonPath) {
    const finalSchema = await configureSchema(schema);
    const result = await graphql(finalSchema, introspectionQuery);
    await writeFileIfDiffers(jsonPath, JSON.stringify(result, null, 2));
    console.log(`Wrote JSON schema to file \`jsonPath\``);
  }

  if (graphqlPath) {
    // Schema language version
    const finalSchema = await configureSchema(schema);
    const graphqlSchema =
      printSchema(finalSchema) +
      `
  """WORKAROUND Zeus problem by appending schema entry points for [query, mutation, supscriptions]. """
  schema {
  query: Query,
  mutation: Mutation
  }
  `;
    await writeFileIfDiffers(graphqlPath, graphqlSchema);
    console.log(`Wrote GraphQL schema to file \`graphqlPath\``);
  }
}
