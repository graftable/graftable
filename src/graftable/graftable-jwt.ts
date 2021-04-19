import cookie from 'cookie';
import { IncomingHttpHeaders, ServerResponse } from 'http';
import jwt from 'jwt-simple';
import { GRAFTABLE_PREFIX, jwtDataName, jwtSignatureName } from './graftable-config';

// LOOK: Configure JWT_SECRET here outside of graftable-config.
//       Contains secret key not to be imported or used from client-side files.
const { [GRAFTABLE_PREFIX + 'JWT_SECRET']: jwtSecretInput } = process.env;

if (!jwtSecretInput || !jwtSecretInput.trim()) {
  throw new Error(`${GRAFTABLE_PREFIX + 'JWT_SECRET'} must be defined`);
}
const jwtSecret = jwtSecretInput;

function jwtClaimsToReq() {
  return function jwtClaimsMiddleware(req: { headers: IncomingHttpHeaders, jwtClaims: any }, _res: ServerResponse, next: Function) {
    const cookies = cookie.parse(req.headers.cookie)
    const jwtData = cookies[jwtDataName];
    const jwtSignature = cookies[jwtSignatureName];
    if (jwtData && jwtSignature) {
      try {
        const claims = jwt.decode(`${jwtData}.${jwtSignature}`, jwtSecret);
        // TODO check iat and nbf
        // TODO check a blacklist from cache for logouts
        // TODO rate limit
        req.jwtClaims = claims;
      } catch(e) {
        // TODO add login flow here
        // TODO reset cookie here?
        console.log(e);
      }
    }
    return next();
  }
}

export default jwtClaimsToReq;
