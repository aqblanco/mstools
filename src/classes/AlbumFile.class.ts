import { Album } from "./Album.class";
import { AlbumDirectory } from "./AlbumDirectory.class";
import { CompressedFileHandler } from "./CompressedFileHandler.class";
import { readdir } from "fs";

export class AlbumFile {
    // Pre-extraction file

    private fPath: string;
    private fName: string;
    private readonly extension: string = "";

    /**
     * Creates an instance of AlbumFile.
     * @param fPath 
     */
    constructor (fPath: string, fName: string) {
        this.fPath = fPath;
        this.fName = fName;
    }

    /**
     * Getter $fPath
     * @return {string}
     */
	public get $fPath(): string {
		return this.fPath;
	}

    /**
     * Setter $fPath
     * @param {string} value
     */
	public set $fPath(value: string) {
		this.fPath = value;
    }

    /**
     * Getter $fName
     * @return {string}
     */
	public get $fName(): string {
		return this.fName;
	}

    /**
     * Setter $fName
     * @param {string} value
     */
	public set $fName(value: string) {
		this.fName = value;
	}

    /**
     * Getter $extension
     * @param {string} value
     */
	public get $extension() {
        let path = require('path');
        
        return path.extname(this.fName);
    }
    
    /**
     * Tries to get album's title, artist and year from the file's name
     * @returns 
     */
    public getAlbumInfo(): Promise<Album> {
        const regex = /((?:[\wÀ-ÿ\.,()'!]+(?:[,\.](?: )?)?(?:\b[-]\b)?[\wÀ-ÿ\.,()'!]+(?:\b \b)?)+)(?: - ){1}([\wÀ-ÿ\.,\s()'!\[\]-]+)(?:[,\.](?: )?)?(?: - )([0-9]{4}) OHM/g;
        let album: Album | null = null;
        let m;
        let fName = this.fName;

        return new Promise((resolve, reject) => {
            while ((m = regex.exec(fName)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                album = new Album(m[1],m[2], m[3]);
            }
            if (album == null) {
                reject(new Error("Could not match file name"));
                return;
            } else {
                resolve(album);
            }
            
        });
    }

    /**
     * Extracts album file
     * @param outputPath Path where to extract the file
     * @returns extract 
     */
    public extract(outputPath: string): Promise<AlbumDirectory> {
        const path = require('path');

        let file = path.join(this.fPath, this.fName);

        return new Promise((resolve, reject) => {
            let extractPath = "";
            this.getAlbumInfo().then((album) => {
                extractPath = path.join(outputPath, album.$artist);
                let cfh = new CompressedFileHandler(this.$extension);
                return cfh.getStrategy().extract(file, extractPath);
            })
            .then((extractedF) => {
                if (extractedF === null) {
                    // Try to manually find extracted directory
                    readdir(extractPath, (err, l) => {
                        if (err) {
                            reject(err);
                        } else {
                            let f = path.parse(file).name;
                            l.forEach((e) => {
                                if (f == e) {
                                    
                                }
                            });
                            resolve(new AlbumDirectory(extractedF));
                        }
                    });  
                } else {
                    extractedF = path.join(extractPath, extractedF);
                    resolve(new AlbumDirectory(extractedF));
                }           
            })
            .catch((e) => {
                reject(e);
            });
        });
    }
}
