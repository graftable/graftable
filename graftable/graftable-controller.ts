import { postgraphile } from 'postgraphile';
import { databaseSchema, pgPool, postgraphileOptions } from './graphql-config';

const postgraphileHandler = postgraphile(pgPool, databaseSchema, postgraphileOptions);

export default postgraphileHandler;
export { postgraphileHandler };
