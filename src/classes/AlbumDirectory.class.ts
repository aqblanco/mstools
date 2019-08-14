import { chmod, chown, open, rename } from "fs";

export class AlbumDirectory {
    // Post-extraction directory

    private dPath: string;

	constructor($dPath: string) {
		this.dPath = $dPath;
	}

    /**
     * Getter $dPath
     * @return {string}
     */
	public get $dPath(): string {
		return this.dPath;
	}

    /**
     * Setter $dPath
     * @param {string} value
     */
	public set $dPath(value: string) {
		this.dPath = value;
    }
    
    /**
     * Cleans up album title
     * @returns Clean album title 
     */
    public cleanUpAlbumTitle(): Promise<AlbumDirectory> {
        let path = require('path');

        let regex = [
            /\[[^\]]*\] */g,
            / OHM$/g
        ];
        let originalPath = this.dPath;
        let parsedPath = path.parse(originalPath);
        let ad = parsedPath.base;

        return new Promise((resolve, reject) => {
            let cleanedName = ad;
            regex.forEach((rx) => {
                cleanedName = cleanedName.replace(rx, '')
            })
            if (cleanedName != ad) {
                let newPath = path.join(parsedPath.dir, cleanedName);
                rename(originalPath, newPath, (err) => {
                    if (err) reject (err);
                    else resolve(new AlbumDirectory(newPath));
                });
            }
        });
    }

    /**
     * Sets permissions of the directory
     * @param perm New directory's permissions
     * @returns Promise 
     */
    public setPermissions(perm: number | string): Promise<AlbumDirectory> {
        var chmodr = require('chmodr');

        let dPath = this.dPath;
        let ad = this;
        return new Promise((resolve, reject) => {
            chmodr(dPath, perm, (e: Error) => {
                if (e) reject(e);
                resolve(ad);
            })
        });
    }

    /**
     * Changes owner and group of the directory
     * @param user New directory's user
     * @param group New directory's group
     * @returns Promise 
     */
    public changeOwner(user: string, group: string): Promise<AlbumDirectory> {
        var chownr = require('chownr');

        let dPath = this.dPath;
        let ad = this;
        return new Promise((resolve, reject) => {
            let userid = require('userid');
            let uid = userid.uid(user);
            let gid = userid.gid(group);
            chownr(dPath, uid, gid, (e: Error) => {
                if (e) reject(e);
                resolve(ad);
            })
        });
    }
    
}