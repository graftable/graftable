import pg from 'pg';
import { GRAFTABLE_PREFIX } from './graftable-config'

// LOOK Configure DATABASE_URL here outside of graftable-config
// LOOK Typically contains password not to be imported and used
// LOOK from client-side files.
const { [GRAFTABLE_PREFIX + 'DATABASE_URL']: databaseUrl = 'postgres://localhost/graftable' } = process.env;

const pgPool = new pg.Pool({ connectionString: databaseUrl });

export { pgPool }
