"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlServerOperate = void 0;
const graphql_1 = require("graphql");
const postgraphile_1 = require("postgraphile");
const graftable_pgpool_1 = require("./graftable-pgpool");
async function graphqlServerOperate(schema, source, rootValue, variableValues, operationName) {
    return await postgraphile_1.withPostGraphileContext({
        pgPool: graftable_pgpool_1.pgPool
        // jwtToken: jwtToken,
        // jwtSecret: "...",
        // pgDefaultRole: "..."
    }, async (context) => {
        // Execute your GraphQL query in this function with the provided
        // `context` object, which should NOT be used outside of this
        // function.
        return await graphql_1.graphql(schema, // The schema from `createPostGraphileSchema`
        source, rootValue, {
            ...context
            // TODO jwtClaims?
        }, // You can add more to context if you like
        variableValues, operationName);
    });
}
exports.graphqlServerOperate = graphqlServerOperate;
//# sourceMappingURL=graftable-server-operate.js.map