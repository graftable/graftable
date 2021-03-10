import { postgraphile } from 'postgraphile';
import { databaseSchema, postgraphileOptions } from './graftable-config';
import { pgPool } from './graftable-pgpool';

const postgraphileHandler = postgraphile(pgPool, databaseSchema, postgraphileOptions);

export default postgraphileHandler;
export { postgraphileHandler };
