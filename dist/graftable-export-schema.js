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
exports.exportSchema = void 0;
const fs_1 = require("fs");
const GQL = __importStar(require("graphql"));
const graphql_1 = require("graphql");
const util_1 = require("util");
const graftable_config_server_1 = require("./graftable-config-server");
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
async function exportSchema(schemaOrPromise, options = { exportGqlSchemaPath: graftable_config_server_1.graphqlFile }) {
    const jsonPath = typeof options.exportJsonSchemaPath === 'string' && options.exportJsonSchemaPath;
    const graphqlPath = typeof options.exportGqlSchemaPath === 'string' && options.exportGqlSchemaPath;
    if (!jsonPath && !graphqlPath) {
        console.log(`Info: no export paths specified`);
        return;
    }
    const schemaBase = schemaOrPromise || (await Promise.resolve().then(() => __importStar(require('./graftable-schema')))).schemaPromise;
    const schema = (options.sortExport && graphql_1.lexicographicSortSchema && graphql_1.lexicographicSortSchema(await schemaBase)) || (await schemaBase);
    // JSON schema
    if (jsonPath) {
        const result = await graphql_1.graphql(schema, introspectionQuery);
        await writeFileIfDiffers(jsonPath, JSON.stringify(result, null, 2));
        console.log(`Wrote JSON schema to file \`jsonPath\``);
    }
    // GraphQL schema
    if (graphqlPath) {
        const graphqlSchema = graphql_1.printSchema(schema) +
            `
"""WORKAROUND Zeus problem by appending schema entry points for [query, mutation, supscriptions]. """
schema {
  query: Query,
  mutation: Mutation
}
`;
        await writeFileIfDiffers(graphqlPath, graphqlSchema);
        console.log(`Done: wrote GraphQL schema to file \`${graphqlPath}\``);
    }
}
exports.exportSchema = exportSchema;
//# sourceMappingURL=graftable-export-schema.js.map