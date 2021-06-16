"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exportPostGraphileSchema_js_1 = __importDefault(require("postgraphile/build/postgraphile/schema/exportPostGraphileSchema.js"));
const graftable_config_1 = require("./graftable-config");
const graftable_schema_1 = require("./graftable-schema");
(async () => {
    const schema = await graftable_schema_1.postgraphileSchemaPromise;
    await exportPostGraphileSchema_js_1.default(schema, { exportGqlSchemaPath: graftable_config_1.graphqlFile });
})();
//# sourceMappingURL=graftable-export-schema.js.map