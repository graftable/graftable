#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const graftable_config_server_1 = require("./graftable-config-server");
const commands = {
    destroy: async () => {
        const psql = `psql postgres < ${graftable_config_server_1.databaseFile}`;
        await child_process_1.spawn(psql, [], {
            shell: true
        });
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
//# sourceMappingURL=graftable.js.map