#! /usr/bin/env node
import { spawn, spawnSync } from 'child_process';
import { CommandCompleteMessage } from 'pg-protocol/dist/messages';
import { databaseUrl, databaseFile } from './graftable-config-server';

const commands = {
  destroy: async () => {
    const psql = `psql postgres < ${databaseFile}`;
    await spawn(psql, [], {
      shell: true
    })
  }
  // graphql: 'echo graphql',
  // seed: 'echo seed',
  // typescript: 'echo typescript'
};

const commandKeys = Object.keys(commands);


console.log(commands);
console.log(commandKeys);



const args = process.argv.slice(2).map(a => a.toLowerCase());
const argErrors = args.map(a => commandKeys.includes(a) ? undefined : a);
const hasErrors = argErrors.flatMap(a => []).length;

console.log(args);
console.log(argErrors);
console.log(hasErrors);
