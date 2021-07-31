#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const envPath = path_1.default.resolve(__dirname, '../../../.env');
const envPathLocal = path_1.default.resolve(__dirname, '../../../.env.local');
dotenv_1.default.config({ path: envPath });
dotenv_1.default.config({ path: envPathLocal });
const child_process_1 = require("child_process");
const CLIClass_1 = require("graphql-zeus/lib/CLI/CLIClass");
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
        const seedImport = `~/${graftable_config_server_1.databaseSeed}`;
        console.log(seedImport);
        const seed = require(seedImport);
        console.log(seed);
        seed();
    },
    typescript: async () => {
        return await CLIClass_1.CLI.execute({ _: [`./${graftable_config_server_1.graphqlFile}`, `./${graftable_config_server_1.graphqlDir}/`], typescript: true, $0: '' });
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
(async () => {
    for await (const a of args) {
        const command = commands[a];
        try {
            await command();
            console.log(`Done: running \`graftable ${a}\` command.`);
        }
        catch (e) {
            console.log(`Error: running \`graftable ${a}\` command.`);
            throw e;
        }
    }
    process.exit();
})();
//# sourceMappingURL=graftable.js.map