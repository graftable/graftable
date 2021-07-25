"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgPool = void 0;
const pg_1 = require("pg");
const graftable_config_server_1 = require("./graftable-config-server");
const pgPool = new pg_1.Pool({ connectionString: graftable_config_server_1.databaseUrl });
exports.pgPool = pgPool;
//# sourceMappingURL=graftable-pgpool.js.map