import { Source } from 'graphql';
export default function graphqlServerFetch(source: string | Source): Promise<{
    [key: string]: any;
} | null | undefined>;
export { graphqlServerFetch };
