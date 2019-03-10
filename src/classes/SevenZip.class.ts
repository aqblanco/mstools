import { CompressedFileStrategy } from "../interfaces/CompressedFileStrategy.interface";

export class SevenZip implements CompressedFileStrategy {
    public extract(filePath: string, outputPath: string): Promise<string> {
        const _7z = require('7zip-min');
        return new Promise((resolve, reject) => {
            _7z.unpack(filePath, outputPath, (e: Error) => {
                if (e) {
                    reject(e);
                    return;
                }
                resolve(outputPath);
            });
        })
    }
}