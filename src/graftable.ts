#! /usr/bin/env node
import { spawn, spawnSync } from 'child_process';
import { CommandCompleteMessage } from 'pg-protocol/dist/messages';
import { databaseUrl, databaseFile } from './graftable-config-server';

const commands = {
  destroy: async () => {
    const psql = `psql postgres < ${databaseFile}`;
    return await spawn(psql, [], {
      shell: true,
      stdio: 'inherit'
    });
  },
  graphql: async () => {
    const graphql = `echo graphql`;
    await spawn(graphql, [], {
      shell: true,
      stdio: 'inherit'
    });
  },
  seed: async () => {
    const seed = `echo seed`;
    await spawn(seed, [], {
      shell: true,
      stdio: 'inherit'
    });
  },
  typescript: async () => {
    const typescript = `echo typescript`;
    await spawn(typescript, [], {
      shell: true,
      stdio: 'inherit'
    });
  }
};

type Command = keyof typeof commands;

const commandKeys = Object.keys(commands);

const args = process.argv.slice(2).map(a => a.toLowerCase());
const argErrors = args.map(a => commandKeys.includes(a) ? undefined : a);
const hasErrors = !!argErrors.flatMap(a => a ? a : []).length;

argErrors.map(a => {
  if(a) {
    console.log(`Error: \`${a}\` is not a \`graftable\` command.`);
  }
});

if(hasErrors) {
  process.exit(1);
}

args.map(a => console.log(commands[a as Command]()));
