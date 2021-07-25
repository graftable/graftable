#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const graftable_config_server_1 = require("./graftable-config-server");
const commands = {
    destroy: `psql postgres < ${graftable_config_server_1.databaseFile} -h ${graftable_config_server_1.databaseUrl}`,
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
args.map(a => child_process_1.spawnSync(commands[a.toLowerCase()]));
//# sourceMappingURL=graftable.js.map