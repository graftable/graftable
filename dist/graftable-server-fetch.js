"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlServerFetch = void 0;
const graftable_schema_1 = require("./graftable-schema");
const graftable_server_operate_1 = require("./graftable-server-operate");
async function graphqlServerFetch(source) {
    const schema = await graftable_schema_1.postgraphileSchemaPromise;
    const { data, errors } = await graftable_server_operate_1.graphqlServerOperate(schema, source);
    if (errors === null || errors === void 0 ? void 0 : errors.length) {
        throw errors;
    }
    return data;
}
exports.graphqlServerFetch = graphqlServerFetch;
//# sourceMappingURL=graftable-server-fetch.js.map