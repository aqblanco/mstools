export interface CompressedFileStrategy {
    extract(filePath: string, outputPath: string): Promise<any>;
}