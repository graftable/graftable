"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = __importDefault(require("cookie"));
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const graftable_config_1 = require("./graftable-config");
// LOOK: Configure JWT_SECRET here outside of graftable-config.
//       Contains secret key not to be imported or used from client-side files.
const { [graftable_config_1.GRAFTABLE_PREFIX + 'JWT_SECRET']: jwtSecretInput } = process.env;
if (!jwtSecretInput || !jwtSecretInput.trim()) {
    throw new Error(`${graftable_config_1.GRAFTABLE_PREFIX + 'JWT_SECRET'} must be defined`);
}
const jwtSecret = jwtSecretInput;
function jwtClaimsToReq() {
    return function jwtClaimsMiddleware(req, _res, next) {
        if (!req.headers.cookie) {
            return next();
        }
        const cookies = cookie_1.default.parse(req.headers.cookie);
        const jwtData = cookies[graftable_config_1.jwtDataName];
        const jwtSignature = cookies[graftable_config_1.jwtSignatureName];
        if (jwtData && jwtSignature) {
            try {
                const claims = jwt_simple_1.default.decode(`${jwtData}.${jwtSignature}`, jwtSecret);
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
exports.default = jwtClaimsToReq;
//# sourceMappingURL=graftable-jwt.js.map