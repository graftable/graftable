import cookie from 'cookie';
import jwt from 'jwt-simple';
import { GRAFTABLE_PREFIX, jwtDataName, jwtSignatureName } from './graftable-config';
// LOOK: Configure JWT_SECRET here outside of graftable-config.
//       Contains secret key not to be imported or used from client-side files.
var _a = process.env, _b = GRAFTABLE_PREFIX + 'JWT_SECRET', jwtSecretInput = _a[_b];
if (!jwtSecretInput || !jwtSecretInput.trim()) {
    throw new Error(GRAFTABLE_PREFIX + 'JWT_SECRET' + " must be defined");
}
var jwtSecret = jwtSecretInput;
function jwtClaimsToReq() {
    return function jwtClaimsMiddleware(req, _res, next) {
        if (!req.headers.cookie) {
            return next();
        }
        var cookies = cookie.parse(req.headers.cookie);
        var jwtData = cookies[jwtDataName];
        var jwtSignature = cookies[jwtSignatureName];
        if (jwtData && jwtSignature) {
            try {
                var claims = jwt.decode(jwtData + "." + jwtSignature, jwtSecret);
                // TODO check iat and nbf
                // TODO check a blacklist from cache for logouts
                // TODO rate limit
                req.jwtClaims = claims;
            }
            catch (e) {
                // TODO add login flow here
                // TODO reset cookie here?
                console.log(e);
            }
        }
        return next();
    };
}
export default jwtClaimsToReq;
