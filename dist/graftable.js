#! /usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const dotenv_1 = __importDefault(require("dotenv"));
// import fs from 'fs';
const CLIClass_1 = require("graphql-zeus/lib/CLI/CLIClass");
const graftable_config_server_1 = require("./graftable-config-server");
const graftable_export_schema_1 = require("./graftable-export-schema");
const path_1 = __importDefault(require("path"));
console.log({ path: path_1.default.resolve(__dirname, '../../../.env') });
console.log({ path: path_1.default.resolve(__dirname, '../../../.env.local') });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env.local') });
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
        return (await Promise.resolve().then(() => __importStar(require(graftable_config_server_1.databaseSeed))))();
    },
    typescript: async () => {
        return await CLIClass_1.CLI.execute({ _: [graftable_config_server_1.graphqlDir, `${graftable_config_server_1.graphqlFile}/`], typescript: true, $0: '' });
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
})();
//# sourceMappingURL=graftable.js.map