#! /usr/bin/env node
import { spawnSync } from 'child_process';
import { databaseUrl, databaseFile } from './graftable-config-server';

const commands: { [k: string]: string } = {
  destroy: `psql postgres < ${databaseFile} -h ${databaseUrl}`,
  graphql: 'echo graphql',
  seed: 'echo seed',
  typescript: 'echo typescript'
};

const commandKeys = Object.keys(commands);

const args = process.argv.slice(2);
const commandErrors = args.flatMap(a => (!commandKeys.includes(a.toLowerCase()) ? a : []));

commandErrors.map(a => console.log(`Error: ${a} is not a valid graftable command`));
if (commandErrors.length) {
  process.exit(1);
}

console.log(commands);
console.log(args);

args.map(a => spawnSync(commands[a.toLowerCase()]));
