#! /usr/bin/env node
import path from 'path';
import dotenv from 'dotenv';
const envPath = path.resolve(__dirname, '../../../.env');
const envPathLocal = path.resolve(__dirname, '../../../.env.local');
console.log(envPath);
console.log(envPathLocal);
dotenv.config({ path: envPath });
dotenv.config({ path: envPathLocal });

import { spawn } from 'child_process';
import { CLI } from 'graphql-zeus/lib/CLI/CLIClass';
import { databaseFile, databaseSeed, graphqlDir, graphqlFile } from './graftable-config-server';
import { exportSchema } from './graftable-export-schema';

const commands = {
  destroy: async () => {
    const psql = `psql postgres < ${databaseFile}`;
    console.log(psql);
    const psqlP = spawn(psql, [], {
      shell: true,
      stdio: 'inherit'
    });
    const exitCode: number = await new Promise((resolve, reject) => {
      psqlP.on('exit', resolve);
    });
    return exitCode == 0;
  },
  graphql: exportSchema,
  seed: async () => {
    return (await import(databaseSeed))();
  },
  typescript: async () => {
    return await CLI.execute({ _: [graphqlDir, `${graphqlFile}/`], typescript: true, $0: '' });
  }
};

// TODO TS_NODE_COMPILER_OPTIONS='{\"module\":\"commonjs\"}' npx ts-node --transpile-only -r dotenv/config node_modules/graftable/dist/graftable-export-schema.js dotenv_config_path=.env.local
// TODO "seed": "npx ts-node --transpile-only -r dotenv/config data/seed/index.ts dotenv_config_path=.env.local",
// TODO "graphql:zeus": "npx zeus graphql/schema.graphql ./graphql --typescript",

type Command = keyof typeof commands;

const commandKeys = Object.keys(commands);

const args = process.argv.slice(2).map(a => a.toLowerCase());
const argErrors = args.map(a => (commandKeys.includes(a) ? undefined : a));
const hasErrors = !!argErrors.flatMap(a => (a ? a : [])).length;

argErrors.map(a => {
  if (a) {
    console.log(`Error: \`graftable ${a}\` is not a command.`);
  }
});

if (hasErrors) {
  process.exit(1);
}

(async () => {
  for await (const a of args) {
    const command = commands[a as Command];
    try {
      await command();
      console.log(`Done: running \`graftable ${a}\` command.`);
    } catch (e) {
      console.log(`Error: running \`graftable ${a}\` command.`);
      throw e;
    }
  }
})();
