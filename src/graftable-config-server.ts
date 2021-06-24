import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
// import { GraphqlAccessPlugin } from './graftable-access-plugin.ts.example';
// import { GraftableAuthenticationPlugin } from './graftable-authenticate-plugin.ts.example';
import PgAggregatesPlugin from '@graphile/pg-aggregates';
import { NodePlugin } from 'graphile-build';
import { TAlgorithm } from 'jwt-simple';
import { PostGraphileOptions } from 'postgraphile';
import PostGraphileConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';

const { GRAFTABLE_PREFIX = '' } = process.env;
const DEFAULT_DATABASE_URL = 'postgres://localhost/graphql';
const DEFAULT_DATABASE_SCHEMA = 'public';

const {
  [GRAFTABLE_PREFIX + 'DATABASE_SCHEMA']: databaseSchema = DEFAULT_DATABASE_SCHEMA,
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

const postgraphileOptions: PostGraphileOptions = {
  async additionalGraphQLContextFromRequest(req, res) {
    return {
      withReqResContext(fn: Function) {
        return fn(req, res, this);
      }
    };
  },
  appendPlugins: [
    // GraphqlAccessPlugin,
    // GraftableAuthenticationPlugin,
    PgAggregatesPlugin,
    PgSimplifyInflectorPlugin,
    PostGraphileConnectionFilterPlugin
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
  skipPlugins: [NodePlugin],
  ...(isDev && {
    enhanceGraphiql: true,
    graphiql: true,
    showErrorStack: true
  })
};

export {
  DEFAULT_DATABASE_URL,
  DEFAULT_DATABASE_SCHEMA,
  GRAFTABLE_PREFIX,
  databaseSchema,
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
