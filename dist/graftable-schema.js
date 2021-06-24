"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgraphileSchemaPromise = void 0;
const postgraphile_1 = require("postgraphile");
const graftable_config_server_1 = require("./graftable-config-server");
const graftable_pgpool_1 = require("./graftable-pgpool");
const postgraphileSchemaPromise = postgraphile_1.createPostGraphileSchema(graftable_pgpool_1.pgPool, graftable_config_server_1.databaseSchema, graftable_config_server_1.postgraphileOptions);
exports.postgraphileSchemaPromise = postgraphileSchemaPromise;
//# sourceMappingURL=graftable-schema.js.map