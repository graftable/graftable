"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgraphileOptions = exports.otpWindow = exports.optStep = exports.otpSetupWindow = exports.jwtSignatureName = exports.jwtMaxAge = exports.jwtAlgorithm = exports.jwtDataName = exports.graphqlFile = exports.databaseSchema = exports.GRAFTABLE_PREFIX = exports.DEFAULT_DATABASE_SCHEMA = exports.DEFAULT_DATABASE_URL = void 0;
const pg_simplify_inflector_1 = __importDefault(require("@graphile-contrib/pg-simplify-inflector"));
// import { GraphqlAccessPlugin } from './graftable-access-plugin.ts.example';
// import { GraftableAuthenticationPlugin } from './graftable-authenticate-plugin.ts.example';
const pg_aggregates_1 = __importDefault(require("@graphile/pg-aggregates"));
const graphile_build_1 = require("graphile-build");
const postgraphile_plugin_connection_filter_1 = __importDefault(require("postgraphile-plugin-connection-filter"));
const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';
const { GRAFTABLE_PREFIX = '' } = process.env;
exports.GRAFTABLE_PREFIX = GRAFTABLE_PREFIX;
const DEFAULT_DATABASE_URL = 'postgres://localhost/graphql';
exports.DEFAULT_DATABASE_URL = DEFAULT_DATABASE_URL;
const DEFAULT_DATABASE_SCHEMA = 'public';
exports.DEFAULT_DATABASE_SCHEMA = DEFAULT_DATABASE_SCHEMA;
const { [GRAFTABLE_PREFIX + 'DATABASE_SCHEMA']: databaseSchema = DEFAULT_DATABASE_SCHEMA, [GRAFTABLE_PREFIX + 'GRAPHQL_DIR']: graphqlDir = 'graphql', [GRAFTABLE_PREFIX + 'GRAPHQL_FILE']: graphqlFile = `${graphqlDir}/schema.graphql`, [GRAFTABLE_PREFIX + 'GRAPHIQL_ROUTE']: graphiqlRoute = '/api/graphiql', [GRAFTABLE_PREFIX + 'GRAPHQL_ROUTE']: graphqlRoute = '/api/graphql', [GRAFTABLE_PREFIX + 'JWT_ALGORITHM']: jwtAlgorithmInput = 'HS256', [GRAFTABLE_PREFIX + 'JWT_DATA_NAME']: jwtDataName = 'graftable_jwt_data', [GRAFTABLE_PREFIX + 'JWT_SIGNATURE_NAME']: jwtSignatureName = 'graftable_jwt_signature', [GRAFTABLE_PREFIX + 'JWT_MAX_AGE']: jwtMaxAgeString = (24 * 60 * 60).toString(), [GRAFTABLE_PREFIX + 'OTP_SETUP_WINDOW']: otpSetupWindow = 5 * 60 * 1000, [GRAFTABLE_PREFIX + 'OPT_STEP']: optStep = 30, [GRAFTABLE_PREFIX + 'OPT_WINDOW']: otpWindow = 1 } = process.env;
exports.databaseSchema = databaseSchema;
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
    console.log(`Add graphql plugins to ${graphqlDir}/plugins`);
}
const postgraphileOptions = {
    async additionalGraphQLContextFromRequest(req, res) {
        return {
            withReqResContext(fn) {
                return fn(req, res, this);
            }
        };
    },
    appendPlugins: [
        // GraphqlAccessPlugin,
        // GraftableAuthenticationPlugin,
        pg_aggregates_1.default,
        pg_simplify_inflector_1.default,
        postgraphile_plugin_connection_filter_1.default,
        ...plugins || []
    ],
    // disableDefaultMutations: true,
    dynamicJson: true,
    graphileBuildOptions: {
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