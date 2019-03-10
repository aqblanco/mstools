import { Argv } from "yargs";
import { extract } from "../cmdHandlers/extract.handler";

export const command = 'extract <file>'
export const describe = 'Extracts an album'
export const builder = {
    file: {
        type: 'string',
        alias: 'f',
        describe: 'Set the file to extract',
        demandOption: true,
    },
    output: {
        type: 'string',
        alias: 'o',
        describe: 'Set path where to extract',
    },
}
export const handler = (argv: Argv) => {
    extract(argv);
};