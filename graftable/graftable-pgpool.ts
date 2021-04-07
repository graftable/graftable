import { Pool } from 'pg';
import { DEFAULT_DATABASE_URL, GRAFTABLE_PREFIX } from './graftable-config'

// LOOK: Configure DATABASE_URL here outside of graftable-config. Typically
//       contains password not to be imported or used from client-side files.
const { [GRAFTABLE_PREFIX + 'DATABASE_URL']: databaseUrl = DEFAULT_DATABASE_URL } = process.env;

const pgPool = new Pool({ connectionString: databaseUrl });

export { pgPool }
