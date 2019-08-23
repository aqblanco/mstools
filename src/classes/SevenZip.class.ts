import { CompressedFileStrategy } from "../interfaces/CompressedFileStrategy.interface";
import { listenerCount } from "cluster";

export class SevenZip implements CompressedFileStrategy {
    public extract(filePath: string, outputPath: string): Promise<string|null> {
        const _7z = require('7zip-min');
        return new Promise((resolve, reject) => {
            _7z.unpack(filePath, outputPath, (e: Error) => {
                if (e) {
                    reject(e);
                    return;
                }
                // Find extracted base folder
                _7z.list(filePath, (e: Error, output: [any]) => {
                    if (e) {
                        reject(e);
                        return;
                    } else {
                        let extractedF = null;

                        for (let i = 0; i < output.length; i++) {
                            // Get the first directory extracted
                            if (output[i].attr == 'D') {
                                extractedF = output[i].name;
                                break;
                            }
                        }

                        resolve(extractedF);
                    }
                });
            });
        })
    }
}