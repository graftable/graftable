import { GraphQLSchema, Source } from 'graphql';
declare function graphqlServerOperate(schema: GraphQLSchema, source: string | Source, rootValue?: any, variableValues?: any, operationName?: any): Promise<import("graphql").ExecutionResult<{
    [key: string]: any;
}, {
    [key: string]: any;
}>>;
export { graphqlServerOperate };
