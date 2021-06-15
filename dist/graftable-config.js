var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import { NodePlugin } from 'graphile-build';
import PostGraphileConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
// import { GraphqlAccessPlugin } from './graftable-access-plugin.ts.example';
// import { GraftableAuthenticationPlugin } from './graftable-authenticate-plugin.ts.example';
var NODE_ENV = process.env.NODE_ENV;
var isDev = NODE_ENV === 'development';
var _a = process.env.GRAFTABLE_PREFIX, GRAFTABLE_PREFIX = _a === void 0 ? '' : _a;
var DEFAULT_DATABASE_URL = 'postgres://localhost/graftable';
var DEFAULT_DATABASE_SCHEMA = 'public';
var _b = process.env, _c = GRAFTABLE_PREFIX + 'DATABASE_SCHEMA', _d = _b[_c], databaseSchema = _d === void 0 ? DEFAULT_DATABASE_SCHEMA : _d, _e = GRAFTABLE_PREFIX + 'GRAPHQL_URL', _f = _b[_e], graphqlUrl = _f === void 0 ? 'http://localhost:3000/api/graphql' : _f, _g = GRAFTABLE_PREFIX + 'GRAPHQL_FILE', _h = _b[_g], graphqlFile = _h === void 0 ? 'graftable/schema.graphql' : _h, _j = GRAFTABLE_PREFIX + 'GRAPHIQL_ROUTE', _k = _b[_j], graphiqlRoute = _k === void 0 ? '/api/graphiql' : _k, _l = GRAFTABLE_PREFIX + 'GRAPHQL_ROUTE', _m = _b[_l], graphqlRoute = _m === void 0 ? '/api/graphql' : _m, _o = GRAFTABLE_PREFIX + 'JWT_ALGORITHM', _p = _b[_o], jwtAlgorithmInput = _p === void 0 ? 'HS256' : _p, _q = GRAFTABLE_PREFIX + 'JWT_DATA_NAME', _r = _b[_q], jwtDataName = _r === void 0 ? 'graftable_jwt_data' : _r, _s = GRAFTABLE_PREFIX + 'JWT_SIGNATURE_NAME', _t = _b[_s], jwtSignatureName = _t === void 0 ? 'graftable_jwt_signature' : _t, _u = GRAFTABLE_PREFIX + 'JWT_MAX_AGE', _v = _b[_u], jwtMaxAgeString = _v === void 0 ? (24 * 60 * 60).toString() : _v, _w = GRAFTABLE_PREFIX + 'OTP_SETUP_WINDOW', _x = _b[_w], otpSetupWindow = _x === void 0 ? 5 * 60 * 1000 : _x, _y = GRAFTABLE_PREFIX + 'OPT_STEP', _z = _b[_y], optStep = _z === void 0 ? 30 : _z, _0 = GRAFTABLE_PREFIX + 'OPT_WINDOW', _1 = _b[_0], otpWindow = _1 === void 0 ? 1 : _1;
// LOOK Avoid JWT no-algorithm-in-payload attacks. Specify the same algorithm
// LOOK when ecoding and decoding. Never rely on payload algorithm value.
// LOOK maintain list independent of `jwt-simple` to protect from upstream problems.
var jwtSupportedAlgorithms = ['HS256', 'HS384', 'HS512', 'RS256'];
if (!jwtSupportedAlgorithms.includes(jwtAlgorithmInput)) {
    throw new Error(GRAFTABLE_PREFIX + 'JWT_ALGORITHM' + " must be one of " + jwtSupportedAlgorithms);
}
var jwtAlgorithm = jwtAlgorithmInput;
var jwtMaxAge = parseInt(jwtMaxAgeString);
var postgraphileOptions = __assign({ additionalGraphQLContextFromRequest: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        withReqResContext: function (fn) {
                            return fn(req, res, this);
                        }
                    }];
            });
        });
    }, appendPlugins: [
        // GraphqlAccessPlugin,
        // GraftableAuthenticationPlugin,
        PgSimplifyInflectorPlugin,
        PostGraphileConnectionFilterPlugin
    ], 
    // disableDefaultMutations: true,
    dynamicJson: true, graphileBuildOptions: {
        pgOmitListSuffix: true
    }, graphiqlRoute: graphiqlRoute,
    graphqlRoute: graphqlRoute, retryOnInitFail: true, simpleCollections: 'only', skipPlugins: [NodePlugin] }, (isDev && {
    enhanceGraphiql: true,
    graphiql: true,
    showErrorStack: true
}));
export { DEFAULT_DATABASE_URL, DEFAULT_DATABASE_SCHEMA, GRAFTABLE_PREFIX, databaseSchema, graphqlFile, graphqlUrl, jwtDataName, jwtAlgorithm, jwtMaxAge, jwtSignatureName, otpSetupWindow, optStep, otpWindow, postgraphileOptions };
