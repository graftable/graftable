"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgraphileController = exports.config = void 0;
const postgraphile_1 = require("postgraphile");
const graftable_config_server_1 = require("./graftable-config-server");
const graftable_pgpool_1 = require("./graftable-pgpool");
const postgraphileController = postgraphile_1.postgraphile(graftable_pgpool_1.pgPool, graftable_config_server_1.databaseSchema, graftable_config_server_1.postgraphileOptions);
exports.postgraphileController = postgraphileController;
const config = {
    api: {
        bodyParser: false,
        externalResolver: true
    }
};
exports.config = config;
exports.default = postgraphileController;
//# sourceMappingURL=graftable-controller.js.map