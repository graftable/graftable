import { makeWrapResolversPlugin } from 'graphile-utils';
import { jwtDataName, jwtMaxAge, jwtSignatureName, jwtSecret, jwtAlgorithm } from './graphql-config';
import jwt, { TAlgorithm } from 'jwt-simple';

const GraphqlAccessPlugin = makeWrapResolversPlugin(
  context => {
    if (context.scope.isRootMutation || context.scope.isRootQuery) {
      if (context.scope.fieldName === 'authenticate') {
        return { scope: context.scope };
      }
    }
    return null;
  },
  () => async (resolve, source, args, context, info) => {
    // context.setJwtClaims();
    if (!context.jwtClaims || !context.jwtClaims.sub) {
      throw new Error('Please invoke `authenticate` before using other query or mutation operations.');
    }
    return resolve(source, args, context, info);
  }
);

export default GraphqlAccessPlugin;

async function getSettingsForPgClientTransaction() {
  // Setup our default role. Once we decode our token, the role may change.
  let role = pgDefaultRole;
  // LOOK decode with default algorithm 'HS256', not the algorithm specified in the token payload.
  // LOOK this is to avoid a no-algorithm attack. If econding changes from the default of 'HS256',
  // LOOK change this decoding to match.
  const jwtClaims = jwt.decode(
    token,
    jwtSecret,
    // LOOK never allow `true` on the following `noVerify` argument.
    // LOOK To do so would disable all security.
    false,
    // LOOK Avoid JWT no-algorithm-in-payload attacks. Specify the same algorithm
    // LOOK when ecoding and decoding. Always use `jwtAlgorithm` from config.
    jwtAlgorithm
  );
  // If we were provided a JWT token, let us try to verify it. If verification
  // fails we want to throw an error.
  if (jwtToken) {
    // Try to run `jwt.verify`. If it fails, capture the error and re-throw it
    // as a 403 error because the token is not trustworthy.
    try {
      // If a JWT token was defined, but a secret was not provided to the server or
      // secret had unsupported type, throw a 403 error.
      if (
        !Buffer.isBuffer(jwtVerificationSecret) &&
        typeof jwtVerificationSecret !== 'string' &&
        typeof jwtVerificationSecret !== 'function'
      ) {
        // tslint:disable-next-line no-console
        console.error(
          `ERROR: '${
            jwtPublicKey ? 'jwtPublicKey' : 'jwtSecret'
          }' was not set to a string or buffer - rejecting JWT-authenticated request.`
        );
        throw new Error('Not allowed to provide a JWT token.');
      }
      if (jwtAudiences != null && jwtVerifyOptions && 'audience' in jwtVerifyOptions)
        throw new Error(`Provide either 'jwtAudiences' or 'jwtVerifyOptions.audience' but not both`);
      const claims = await new Promise((resolve, reject) => {
        jwt.verify(
          jwtToken,
          jwtVerificationSecret,
          {
            ...jwtVerifyOptions,
            audience:
              jwtAudiences ||
              (jwtVerifyOptions && 'audience' in jwtVerifyOptions
                ? undefinedIfEmpty(jwtVerifyOptions.audience)
                : ['postgraphile'])
          },
          (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
          }
        );
      });
      if (typeof claims === 'string') {
        throw new Error('Invalid JWT payload');
      }
      // jwt.verify returns `object | string`; but the `object` part is really a map
      jwtClaims = claims;
      const roleClaim = getPath(jwtClaims, jwtRole);
      // If there is a `role` property in the claims, use that instead of our
      // default role.
      if (typeof roleClaim !== 'undefined') {
        if (typeof roleClaim !== 'string')
          throw new Error(`JWT \`role\` claim must be a string. Instead found '${typeof jwtClaims['role']}'.`);
        role = roleClaim;
      }
    } catch (error) {
      // In case this error is thrown in an HTTP context, we want to add status code
      // Note. jwt.verify will add a name key to its errors. (https://github.com/auth0/node-jsonwebtoken#errors--codes)
      error.statusCode =
        'name' in error && error.name === 'TokenExpiredError'
          ? // The correct status code for an expired ( but otherwise acceptable token is 401 )
            401
          : // All other authentication errors should get a 403 status code.
            403;
      throw error;
    }
  }
  // Instantiate a map of local settings. This map will be transformed into a
  // Sql query.
  const localSettings = [];
  // Set the custom provided settings before jwt claims and role are set
  // this prevents an accidentional overwriting
  if (pgSettings && typeof pgSettings === 'object') {
    for (const key in pgSettings) {
      if (Object.prototype.hasOwnProperty.call(pgSettings, key) && isPgSettingValid(pgSettings[key])) {
        if (key === 'role') {
          role = String(pgSettings[key]);
        } else {
          localSettings.push([key, String(pgSettings[key])]);
        }
      }
    }
  }
  // If there is a rule, we want to set the root `role` setting locally
  // to be our role. The role may only be null if we have no default role.
  if (typeof role === 'string') {
    localSettings.push(['role', role]);
  }
  // If we have some JWT claims, we want to set those claims as local
  // settings with the namespace `jwt.claims`.
  for (const key in jwtClaims) {
    if (Object.prototype.hasOwnProperty.call(jwtClaims, key)) {
      const rawValue = jwtClaims[key];
      // Unsafe to pass raw object/array to pg.query -> set_config; instead JSONify
      const value = rawValue != null && typeof rawValue === 'object' ? JSON.stringify(rawValue) : rawValue;
      if (isPgSettingValid(value)) {
        localSettings.push([`jwt.claims.${key}`, String(value)]);
      }
    }
  }
  return {
    localSettings,
    role,
    jwtClaims: jwtToken ? jwtClaims : null
  };
}
