import { Source } from 'graphql';
declare function graphqlServerFetch(source: string | Source): Promise<{
    [key: string]: any;
} | null | undefined>;
export { graphqlServerFetch };
