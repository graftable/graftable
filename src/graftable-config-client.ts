const { GRAFTABLE_PREFIX = '' } = process.env;

const { [GRAFTABLE_PREFIX + 'GRAPHQL_URL']: graphqlUrl = 'http://localhost:3000/api/graphql' } = process.env;

export { graphqlUrl };
