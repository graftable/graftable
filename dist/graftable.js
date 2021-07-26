#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graftable_config_server_1 = require("./graftable-config-server");
// import { createReadStream } from 'fs';
const commands = {
    destroy: async () => {
        // const fileReadStream = createReadStream(databaseFile);
        const command = `psql postgres < ${graftable_config_server_1.databaseFile}`;
        console.log(command);
        // const psql = spawn(command, [], {
        //   // cwd: process.cwd(),
        //   // env: process.env,
        //   shell: true,
        //   // encoding: 'utf-8'
        //   // stdio: 'inherit'
        // });
        // await psql;
        // psql.stdout.
        // psql.stdin.pipe(fileReadStream.p)
        // psql.stdin.
        // fileReadStream.pipe()
        // databaseFileCat.stdout
        // command: 'psql',
        // args: ['postgres', '<', databaseFile]
    }
    // graphql: 'echo graphql',
    // seed: 'echo seed',
    // typescript: 'echo typescript'
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
args.map(a => {
    const { command } = commands[a.toLowerCase()];
    console.log(commands.destroy);
    command();
});
//# sourceMappingURL=graftable.js.map