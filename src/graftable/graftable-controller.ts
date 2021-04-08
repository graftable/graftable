import { postgraphile } from 'postgraphile';
import { databaseSchema, postgraphileOptions } from './graftable-config';
import { pgPool } from './graftable-pgpool';

const postgraphileController = postgraphile(pgPool, databaseSchema, postgraphileOptions);

export default postgraphileController;
export { postgraphileController };
