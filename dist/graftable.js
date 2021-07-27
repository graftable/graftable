#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const graftable_config_server_1 = require("./graftable-config-server");
const commands = {
    destroy: async () => {
        const psql = `psql postgres < ${graftable_config_server_1.databaseFile}`;
        return await child_process_1.spawn(psql, [], {
            shell: true,
            stdio: 'inherit'
        });
    },
    graphql: async () => {
        const graphql = `echo graphql`;
        await child_process_1.spawn(graphql, [], {
            shell: true,
            stdio: 'inherit'
        });
    },
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
const argErrors = args.map(a => commandKeys.includes(a) ? undefined : a);
const hasErrors = !!argErrors.flatMap(a => a ? a : []).length;
argErrors.map(a => {
    if (a) {
        console.log(`Error: \`${a}\` is not a \`graftable\` command.`);
    }
});
if (hasErrors) {
    process.exit(1);
}
args.map(a => console.log(commands[a]()));
//# sourceMappingURL=graftable.js.map