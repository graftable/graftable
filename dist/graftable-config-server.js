"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgraphileOptions = exports.otpWindow = exports.optStep = exports.otpSetupWindow = exports.jwtSignatureName = exports.jwtMaxAge = exports.jwtAlgorithm = exports.jwtDataName = exports.graphqlFile = exports.graphqlDir = exports.defaultPlugins = exports.databaseUrl = exports.databaseSeed = exports.databaseFile = exports.databaseSchema = exports.DEFAULT_DATABASE_URL = exports.DEFAULT_DATABASE_SCHEMA = exports.GRAFTABLE_PREFIX = void 0;
const pg_order_by_related_1 = __importDefault(require("@graphile-contrib/pg-order-by-related"));
const pg_simplify_inflector_1 = __importDefault(require("@graphile-contrib/pg-simplify-inflector"));
// import { GraphqlAccessPlugin } from './graftable-access-plugin.ts.example';
// import { GraftableAuthenticationPlugin } from './graftable-authenticate-plugin.ts.example';
const pg_aggregates_1 = __importDefault(require("@graphile/pg-aggregates"));
const graphile_build_1 = require("graphile-build");
const postgraphile_plugin_connection_filter_1 = __importDefault(require("postgraphile-plugin-connection-filter"));
const postgraphile_plugin_nested_mutations_1 = __importDefault(require("postgraphile-plugin-nested-mutations"));
const postgraphile_upsert_plugin_1 = require("postgraphile-upsert-plugin");
const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';
const { GRAFTABLE_PREFIX = '' } = process.env;
exports.GRAFTABLE_PREFIX = GRAFTABLE_PREFIX;
const DEFAULT_DATABASE_SCHEMA = 'public';
exports.DEFAULT_DATABASE_SCHEMA = DEFAULT_DATABASE_SCHEMA;
const DEFAULT_DATABASE_URL = 'postgres://localhost/graphql_dev';
exports.DEFAULT_DATABASE_URL = DEFAULT_DATABASE_URL;
const { [GRAFTABLE_PREFIX + 'DATABASE_SCHEMA']: databaseSchema = DEFAULT_DATABASE_SCHEMA, [GRAFTABLE_PREFIX + 'DATABASE_FILE']: databaseFile = 'data/schema.sql', [GRAFTABLE_PREFIX + 'DATABASE_SEED']: databaseSeed = 'data/seed/index', [GRAFTABLE_PREFIX + 'DATABASE_URL']: databaseUrl = DEFAULT_DATABASE_URL, [GRAFTABLE_PREFIX + 'GRAPHQL_DIR']: graphqlDir = 'graphql', [GRAFTABLE_PREFIX + 'GRAPHQL_FILE']: graphqlFile = `${graphqlDir}/schema.graphql`, [GRAFTABLE_PREFIX + 'GRAPHIQL_ROUTE']: graphiqlRoute = '/api/graphiql', [GRAFTABLE_PREFIX + 'GRAPHQL_ROUTE']: graphqlRoute = '/api/graphql', [GRAFTABLE_PREFIX + 'JWT_ALGORITHM']: jwtAlgorithmInput = 'HS256', [GRAFTABLE_PREFIX + 'JWT_DATA_NAME']: jwtDataName = 'graftable_jwt_data', [GRAFTABLE_PREFIX + 'JWT_SIGNATURE_NAME']: jwtSignatureName = 'graftable_jwt_signature', [GRAFTABLE_PREFIX + 'JWT_MAX_AGE']: jwtMaxAgeString = (24 * 60 * 60).toString(), [GRAFTABLE_PREFIX + 'OTP_SETUP_WINDOW']: otpSetupWindow = 5 * 60 * 1000, [GRAFTABLE_PREFIX + 'OPT_STEP']: optStep = 30, [GRAFTABLE_PREFIX + 'OPT_WINDOW']: otpWindow = 1 } = process.env;
exports.databaseSchema = databaseSchema;
exports.databaseFile = databaseFile;
exports.databaseSeed = databaseSeed;
exports.databaseUrl = databaseUrl;
exports.graphqlDir = graphqlDir;
exports.graphqlFile = graphqlFile;
exports.jwtDataName = jwtDataName;
exports.jwtSignatureName = jwtSignatureName;
exports.otpSetupWindow = otpSetupWindow;
exports.optStep = optStep;
exports.otpWindow = otpWindow;
// LOOK Avoid JWT no-algorithm-in-payload attacks. Specify the same algorithm
// LOOK when ecoding and decoding. Never rely on payload algorithm value.
// LOOK maintain list independent of `jwt-simple` to protect from upstream problems.
const jwtSupportedAlgorithms = ['HS256', 'HS384', 'HS512', 'RS256'];
if (!jwtSupportedAlgorithms.includes(jwtAlgorithmInput)) {
    throw new Error(`${GRAFTABLE_PREFIX + 'JWT_ALGORITHM'} must be one of ${jwtSupportedAlgorithms}`);
}
const jwtAlgorithm = jwtAlgorithmInput;
exports.jwtAlgorithm = jwtAlgorithm;
const jwtMaxAge = parseInt(jwtMaxAgeString);
exports.jwtMaxAge = jwtMaxAge;
let plugins;
try {
    plugins = require(`~/${graphqlDir}/plugins`);
}
catch (e) {
    console.log(`Info: graphql plugins can be added to the ${graphqlDir}/plugins directory`);
}
const defaultPlugins = [
    // GraftableAuthenticationPlugin,
    // GraphqlAccessPlugin,
    pg_aggregates_1.default,
    postgraphile_upsert_plugin_1.PgMutationUpsertPlugin,
    pg_order_by_related_1.default,
    pg_simplify_inflector_1.default,
    postgraphile_plugin_connection_filter_1.default,
    postgraphile_plugin_nested_mutations_1.default
];
exports.defaultPlugins = defaultPlugins;
const postgraphileOptions = {
    async additionalGraphQLContextFromRequest(req, res) {
        return {
            withReqResContext(fn) {
                return fn(req, res, this);
            }
        };
    },
    appendPlugins: [...defaultPlugins, ...(plugins || [])],
    // disableDefaultMutations: true,
    dynamicJson: true,
    graphileBuildOptions: {
        connectionFilterRelations: true,
        pgOmitListSuffix: true
    },
    graphiqlRoute,
    graphqlRoute,
    retryOnInitFail: true,
    simpleCollections: 'only',
    skipPlugins: [graphile_build_1.NodePlugin],
    ...(isDev && {
        enhanceGraphiql: true,
        graphiql: true,
        showErrorStack: true
    })
};
exports.postgraphileOptions = postgraphileOptions;
//# sourceMappingURL=graftable-config-server.js.map