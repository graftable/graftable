import bcrypt from 'bcryptjs';
import cookie from 'cookie';
import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import { ClientRequest } from 'http';
import jwt from 'jwt-simple';
import { GRAFTABLE_PREFIX, jwtAlgorithm, jwtDataName, jwtMaxAge, jwtSignatureName } from './graftable-config';
import { graphqlServerOperate } from './graftable-server-operate';

// LOOK: Configure JWT_SECRET here outside of graftable-config.
//       Contains secret not to be imported or used from client-side files.
const { [GRAFTABLE_PREFIX + 'JWT_SECRET']: jwtSecret } = process.env;
// TODO check secret

export function encodeAuthenticationJwt(authenticatedUser: any, roles = ['user']) {
  if(!roles.includes('user') && !roles.includes('admin')) {
    throw new Error('No valid authentication roles were provided.');
  }
  const nowSeconds = Math.floor(Date.now() / 1000);
  return jwt.encode(
    {
      sub: authenticatedUser.id,
      aud: ['postgraphile'],
      iat: nowSeconds,
      nbf: nowSeconds,
      org: authenticatedUser.organizationId,
      otp: !!authenticatedUser.oneTimePasswordSecret,
      roles
    },
    jwtSecret,
    // LOOK Avoid JWT no-algorithm-in-payload attacks. Specify the same algorithm
    // LOOK when ecoding and decoding. Always use `jwtAlgorithm` from config.
    jwtAlgorithm,
  );
}

function setJwtCookies(user: any, graphqlContext: any) {
  const authenticationJwt = encodeAuthenticationJwt(user);
  const [jwtHeader, jwtPayload, jwtSignature] = authenticationJwt.split('.');

  const jwtDataCookie = cookie.serialize(jwtDataName, `${jwtHeader}.${jwtPayload}`, {
    // TODO set domain too?
    maxAge: jwtMaxAge,
    path: '/',
    secure: process.env.NODE_ENV !== 'development'
  });
  const jwtSignatureCookie = cookie.serialize(jwtSignatureName, jwtSignature, {
    // TODO set domain too?
    httpOnly: true,
    maxAge: jwtMaxAge,
    path: '/',
    secure: process.env.NODE_ENV !== 'development'
  });

  const { withReqResContext } = graphqlContext;
  withReqResContext((req: ClientRequest, res: ClientRequest, ctx: any) => {
    res.setHeader('Set-Cookie', [jwtDataCookie, jwtSignatureCookie]);
  });
}

function deleteJwtCookies(graphqlContext: any) {
  const expires = new Date();
  const jwtDataCookie = cookie.serialize(jwtDataName, '', {
    // TODO set domain too?
    expires,
    path: '/',
    secure: process.env.NODE_ENV !== 'development'
  });
  const jwtSignatureCookie = cookie.serialize(jwtSignatureName, '', {
    // TODO set domain too?
    expires,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV !== 'development'
  });

  const { withReqResContext } = graphqlContext;
  withReqResContext((req: ClientRequest, res: ClientRequest, ctx: any) => {
    res.setHeader('Set-Cookie', [jwtDataCookie, jwtSignatureCookie]);
  });
}

const GraftableAuthenticationPlugin = makeExtendSchemaPlugin(build => ({
  typeDefs: gql`
    input AuthenticateInput {
      email: String!
      password: String!
      oneTimePassword: String
    }

    enum AuthenticateResult {
      FAILURE_EMAIL_OR_PASSWORD
      FAILURE_INPUT_EMAIL
      FAILURE_INPUT_EMAIL_PASSWORD
      FAILURE_INPUT_PASSWORD
      FAILURE_ONE_TIME_PASSWORD
      FAILURE_RATE_LIMIT
      SUCCESS
    }

    type AuthenticatePayload {
      id: UUID
      result: AuthenticateResult
      query: Query
    }

    extend type Mutation {
      authenticate(input: AuthenticateInput!): AuthenticatePayload
    }
  `,
  resolvers: {
    Mutation: {
      authenticate: async (_query, args, context, resolveInfo) => {
        const { email, password } = args.input;

        if (!email.trim() && !password.trim()) {
          deleteJwtCookies(context);
          return {
            result: 'FAILURE_INPUT_EMAIL_PASSWORD'
          };
        }

        if (!email.trim()) {
          deleteJwtCookies(context);
          return {
            result: 'FAILURE_INPUT_EMAIL'
          };
        }

        if (!password.trim()) {
          deleteJwtCookies(context);
          return {
            result: 'FAILURE_INPUT_PASSWORD'
          };
        }

        const { schema } = resolveInfo;

        const query = `query {
          users(condition: { email: ${email.toLowerCase()} }) {
            id,
            email,
            passwordHash
          }
        }`;


        const { data, errors } = await graphqlServerOperate(schema, query);
        if (errors?.length) {
          throw errors[0];
        }

        const { users } = data;

        console.log(users);

        if (users?.length != 1) {
          deleteJwtCookies(context);
          return {
            result: 'FAILURE_EMAIL_OR_PASSWORD'
          };
        }

        if (!users[0]?.passwordHash) {
          deleteJwtCookies(context);
          return {
            result: 'FAILURE_EMAIL_OR_PASSWORD'
          };
        }

        const passwordMatches = await bcrypt.compare(password, users[0].passwordHash);

        if (!passwordMatches) {
          deleteJwtCookies(context);
          return {
            result: 'FAILURE_EMAIL_OR_PASSWORD'
          };
        }

        // LOOK Rate limit here
        let attemptsExceeded = false;

        const user = users[0];

        setJwtCookies(user, context);

        return {
          id: user.id,
          result: 'SUCCESS'
        };
      }
    }
  }
}));
 
export default GraftableAuthenticationPlugin;
export { GraftableAuthenticationPlugin };
