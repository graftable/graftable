import { Pool } from 'pg';
import { databaseUrl } from './graftable-config-server'

const pgPool = new Pool({ connectionString: databaseUrl });

export { pgPool }
