#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const graftable_config_server_1 = require("./graftable-config-server");
const graftable_export_schema_1 = require("./graftable-export-schema");
const commands = {
    destroy: async () => {
        const psql = `psql postgres < ${graftable_config_server_1.databaseFile}`;
        console.log(psql);
        const psqlP = child_process_1.spawn(psql, [], {
            shell: true,
            stdio: 'inherit'
        });
        const exitCode = await new Promise((resolve, reject) => {
            psqlP.on('exit', resolve);
        });
        return exitCode == 0;
    },
    graphql: graftable_export_schema_1.exportSchema,
    seed: async () => {
        const seed = `echo seed`;
        await child_process_1.spawn(seed, [], {
            shell: true,
            stdio: 'inherit'
        });
    },
    typescript: async () => {
        const typescript = `echo typescript`;
        await child_process_1.spawn(typescript, [], {
            shell: true,
            stdio: 'inherit'
        });
    }
};
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
// (async () => await commands.destroy())();
(async () => await commands.graphql())();
// // (async () =>
//   args.reduce(async (p, a) => {
//     const command = commands[a as Command];
//     if (await p) {
//       return p;
//     }
//     try {
//       await command();
//       console.log(`Done: running \`graftable ${a}\` command.`);
//       return p;
//     } catch (e) {
//       console.log(`Error: running \`graftable ${a}\` command.`);
//       throw e;
//     }
//   }, Promise.resolve(false)))();
//# sourceMappingURL=graftable.js.map