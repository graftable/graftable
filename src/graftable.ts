#! /usr/bin/env node
import { spawn, spawnSync } from 'child_process';
import { CommandCompleteMessage } from 'pg-protocol/dist/messages';
import { databaseUrl, databaseFile } from './graftable-config-server';
import { exportSchema } from './graftable-export-schema';

const commands = {
  destroy: async () => {
    const psql = `psql postgres < ${databaseFile}`;
    return await spawn(psql, [], {
      shell: true,
      stdio: 'inherit'
    });
  },
  graphql: async () => {
    await exportSchema();
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


// TODO TS_NODE_COMPILER_OPTIONS='{\"module\":\"commonjs\"}' npx ts-node --transpile-only -r dotenv/config node_modules/graftable/dist/graftable-export-schema.js dotenv_config_path=.env.local

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
