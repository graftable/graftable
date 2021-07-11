import { postgraphile } from 'postgraphile';
import { databaseSchema, postgraphileOptions } from './graftable-config-server';
import { pgPool } from './graftable-pgpool';

const postgraphileController = postgraphile(pgPool, databaseSchema, postgraphileOptions);

const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export default postgraphileController;
export { config, postgraphileController };
