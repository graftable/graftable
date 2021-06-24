"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgPool = void 0;
const pg_1 = require("pg");
const graftable_config_server_1 = require("./graftable-config-server");
// LOOK: Configure DATABASE_URL here outside of graftable-config. Typically
//       contains password not to be imported or used from client-side files.
const { [graftable_config_server_1.GRAFTABLE_PREFIX + 'DATABASE_URL']: databaseUrl = graftable_config_server_1.DEFAULT_DATABASE_URL } = process.env;
const pgPool = new pg_1.Pool({ connectionString: databaseUrl });
exports.pgPool = pgPool;
//# sourceMappingURL=graftable-pgpool.js.map