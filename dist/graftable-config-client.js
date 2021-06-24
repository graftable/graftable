"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlUrl = void 0;
const { GRAFTABLE_PREFIX = '' } = process.env;
const { [GRAFTABLE_PREFIX + 'GRAPHQL_URL']: graphqlUrl = 'http://localhost:3000/api/graphql' } = process.env;
exports.graphqlUrl = graphqlUrl;
//# sourceMappingURL=graftable-config-client.js.map