import { Pool } from 'pg';
import { DEFAULT_DATABASE_URL, GRAFTABLE_PREFIX } from './graftable-config';
// LOOK: Configure DATABASE_URL here outside of graftable-config. Typically
//       contains password not to be imported or used from client-side files.
var _a = process.env, _b = GRAFTABLE_PREFIX + 'DATABASE_URL', _c = _a[_b], databaseUrl = _c === void 0 ? DEFAULT_DATABASE_URL : _c;
var pgPool = new Pool({ connectionString: databaseUrl });
export { pgPool };
