"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const GQL = __importStar(require("graphql"));
const graphql_1 = require("graphql");
const util_1 = require("util");
const graftable_config_1 = require("./graftable-config");
const graftable_schema_1 = require("./graftable-schema");
const introspectionQuery = typeof GQL.getIntrospectionQuery === 'function' ? GQL.getIntrospectionQuery() : GQL.introspectionQuery;
const readFile = util_1.promisify(fs_1.readFile);
const writeFile = util_1.promisify(fs_1.writeFile);
async function writeFileIfDiffers(path, contents) {
    let oldContents = null;
    try {
        oldContents = await readFile(path, 'utf8');
    }
    catch (e) {
        /* noop */
    }
    if (oldContents !== contents) {
        await writeFile(path, contents);
    }
}
/**
 * Exports a PostGraphile schema by looking at a Postgres client.
 */
async function exportPostGraphileSchema(schemaOrPromise, options = {}) {
    const schema = await schemaOrPromise;
    const jsonPath = typeof options.exportJsonSchemaPath === 'string' ? options.exportJsonSchemaPath : null;
    const graphqlPath = typeof options.exportGqlSchemaPath === 'string' ? options.exportGqlSchemaPath : null;
    // Sort schema, if requested
    const finalSchema = options.sortExport && graphql_1.lexicographicSortSchema && (jsonPath || graphqlPath)
        ? graphql_1.lexicographicSortSchema(schema)
        : schema;
    // JSON version
    if (jsonPath) {
        const result = await graphql_1.graphql(finalSchema, introspectionQuery);
        await writeFileIfDiffers(jsonPath, JSON.stringify(result, null, 2));
    }
    // Schema language version
    const graphqlSchema = graphql_1.printSchema(finalSchema) +
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
(async () => await exportPostGraphileSchema(await graftable_schema_1.postgraphileSchemaPromise, { exportGqlSchemaPath: graftable_config_1.graphqlFile }))();
//# sourceMappingURL=graftable-export-schema.js.map