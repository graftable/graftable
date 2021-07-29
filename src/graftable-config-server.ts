import PgOrderByRelatedPlugin from '@graphile-contrib/pg-order-by-related';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
// import { GraphqlAccessPlugin } from './graftable-access-plugin.ts.example';
// import { GraftableAuthenticationPlugin } from './graftable-authenticate-plugin.ts.example';
import PgAggregatesPlugin from '@graphile/pg-aggregates';
import { NodePlugin } from 'graphile-build';
import { TAlgorithm } from 'jwt-simple';
import { PostGraphileOptions } from 'postgraphile';
import PostGraphileConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import PostgraphileNestedMutationsPlugin from 'postgraphile-plugin-nested-mutations';
import { PgMutationUpsertPlugin } from 'postgraphile-upsert-plugin';

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';

const { GRAFTABLE_PREFIX = '' } = process.env;
const DEFAULT_DATABASE_SCHEMA = 'public';
const DEFAULT_DATABASE_URL = 'postgres://localhost/graphql';

const {
  [GRAFTABLE_PREFIX + 'DATABASE_SCHEMA']: databaseSchema = DEFAULT_DATABASE_SCHEMA,
  [GRAFTABLE_PREFIX + 'DATABASE_FILE']: databaseFile = 'data/schema.sql',
  [GRAFTABLE_PREFIX + 'DATABASE_URL']: databaseUrl = DEFAULT_DATABASE_URL,
  [GRAFTABLE_PREFIX + 'GRAPHQL_DIR']: graphqlDir = 'graphql',
  [GRAFTABLE_PREFIX + 'GRAPHQL_FILE']: graphqlFile = `${graphqlDir}/schema.graphql`,
  [GRAFTABLE_PREFIX + 'GRAPHIQL_ROUTE']: graphiqlRoute = '/api/graphiql',
  [GRAFTABLE_PREFIX + 'GRAPHQL_ROUTE']: graphqlRoute = '/api/graphql',
  [GRAFTABLE_PREFIX + 'JWT_ALGORITHM']: jwtAlgorithmInput = 'HS256',
  [GRAFTABLE_PREFIX + 'JWT_DATA_NAME']: jwtDataName = 'graftable_jwt_data',
  [GRAFTABLE_PREFIX + 'JWT_SIGNATURE_NAME']: jwtSignatureName = 'graftable_jwt_signature',
  [GRAFTABLE_PREFIX + 'JWT_MAX_AGE']: jwtMaxAgeString = (24 * 60 * 60).toString(),
  [GRAFTABLE_PREFIX + 'OTP_SETUP_WINDOW']: otpSetupWindow = 5 * 60 * 1000,
  [GRAFTABLE_PREFIX + 'OPT_STEP']: optStep = 30,
  [GRAFTABLE_PREFIX + 'OPT_WINDOW']: otpWindow = 1
} = process.env;

// LOOK Avoid JWT no-algorithm-in-payload attacks. Specify the same algorithm
// LOOK when ecoding and decoding. Never rely on payload algorithm value.
// LOOK maintain list independent of `jwt-simple` to protect from upstream problems.
const jwtSupportedAlgorithms = ['HS256', 'HS384', 'HS512', 'RS256'];
if (!jwtSupportedAlgorithms.includes(jwtAlgorithmInput)) {
  throw new Error(`${GRAFTABLE_PREFIX + 'JWT_ALGORITHM'} must be one of ${jwtSupportedAlgorithms}`);
}
const jwtAlgorithm = jwtAlgorithmInput as TAlgorithm;

const jwtMaxAge = parseInt(jwtMaxAgeString);

let plugins;
try {
  plugins = require(`~/${graphqlDir}/plugins`);
} catch (e) {
  console.log(`Info: graphql plugins can be added to the ${graphqlDir}/plugins directory`);
}

const defaultPlugins = [
  // GraftableAuthenticationPlugin,
  // GraphqlAccessPlugin,
  PgAggregatesPlugin,
  PgMutationUpsertPlugin,
  PgOrderByRelatedPlugin,
  PgSimplifyInflectorPlugin,
  PostGraphileConnectionFilterPlugin,
  PostgraphileNestedMutationsPlugin
];

const postgraphileOptions: PostGraphileOptions = {
  async additionalGraphQLContextFromRequest(req, res) {
    return {
      withReqResContext(fn: Function) {
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
  skipPlugins: [NodePlugin],
  ...(isDev && {
    enhanceGraphiql: true,
    graphiql: true,
    showErrorStack: true
  })
};

export {
  GRAFTABLE_PREFIX,
  DEFAULT_DATABASE_SCHEMA,
  DEFAULT_DATABASE_URL,
  databaseSchema,
  databaseFile,
  databaseUrl,
  defaultPlugins,
  graphqlFile,
  jwtDataName,
  jwtAlgorithm,
  jwtMaxAge,
  jwtSignatureName,
  otpSetupWindow,
  optStep,
  otpWindow,
  postgraphileOptions
};
