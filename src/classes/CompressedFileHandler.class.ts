import { CompressedFileStrategy } from "../interfaces/CompressedFileStrategy.interface";
import { SevenZip } from "./SevenZip.class";

export class CompressedFileHandler {

    private extension: string;

    public constructor(extension: string) {
        this.extension = extension;
    }
    
    public getStrategy(): CompressedFileStrategy {
        let strategy: CompressedFileStrategy;
        switch (this.extension) {
            default: {
                strategy = new SevenZip();
                break;
            }
        }

        return strategy;
    }
}