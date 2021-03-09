import jwt from 'jwt-simple';
import config from '../config';

function jwtClaims() {
  return function jwtClaimsMiddleware(req, _res, next) {
    const jwtData = req.cookies[config.JWT_DATA_NAME];
    const jwtSignature = req.cookies[config.JWT_SIGNATURE_NAME];
    if (jwtData && jwtSignature) {
      try {
        const claims = jwt.decode(`${jwtData}.${jwtSignature}`, config.jwtSecret);
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

export default jwtClaims;
