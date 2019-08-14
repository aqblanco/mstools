import { parse, resolve as resolveP } from "path"
import { Argv } from "yargs";
import { AlbumFile } from "../classes/AlbumFile.class";
import { style } from "../assets/styles";
import { Plex } from "../classes/Plex.class";
import { chmod, chown } from "fs";

export async function extract(argv: Argv): Promise<any> {
    return new Promise ((resolve, reject) => {
        process.env["NODE_CONFIG_DIR"] = resolveP(__dirname + "../../../config/");
        let config = require('config');
        let opt: any = (argv as any);
        let parsedPath = parse(opt.file);
        const path = require('path');
        const fs = require('fs');

        // Read config
        let user = config.get('Extraction.user');
        let group = config.get('Extraction.group');
        let perm = config.get('Extraction.permissions');
        let outputBaseDir = "";
        
        // First, use the option to determine the output path, if avaliable
        if (opt.output) outputBaseDir = opt.output;
        // If not present, try to get it from the config
        if (outputBaseDir == "" && config.has('Extraction.outputBaseDir')) {
            outputBaseDir = config.get('Extraction.outputBaseDir');
        }
        // Finally, if still empty, assign to the current dir
        if (outputBaseDir == "") outputBaseDir = "./";
        
        let albumF = new AlbumFile(parsedPath.dir, parsedPath.base);
        console.log(style.prompt('> ') + "Extracting " + style.file(parsedPath.base)) + "...";
        // Check that the parent folder exists
        let parentExists = true;
        let extractPath = outputBaseDir;
        albumF.getAlbumInfo().then((album) => {
            extractPath = path.join(outputBaseDir, album.$artist);
            // Check if the file exists in the current directory.
            fs.access(extractPath, fs.constants.F_OK, (e : Error) => {
                parentExists = e ? false : true ;
            });
            return albumF.extract(outputBaseDir);
        // Try to extract
        }).then((albumDir) => {
            console.log(style.prompt('> ') + style.file(parsedPath.base) + " " + style.keyword("extracted") + " to " + style.folder(resolveP(albumDir.$dPath)));
            if (!parentExists) {
                updateParentFolder(extractPath, perm, user, group);
            }
            // Clean up file name from possible tags
            return albumDir.cleanUpAlbumTitle();
        }).then((albumDir) => {
            console.log(style.prompt('> ') + "Album folder renamed to " + style.folder(resolveP(albumDir.$dPath)));
            // Try to change file owner
            return albumDir.changeOwner(user, group);
        }).then((albumDir) => {
            console.log(style.prompt('> ') + style.folder(resolveP(albumDir.$dPath)) + " " + style.keyword("owner") + " changed to " + style.value(user) + ":" + style.value(group));
            // Try to set file permissions
            return albumDir.setPermissions(perm);
        }).then((albumDir) => {
            console.log(style.prompt('> ') + style.folder(resolveP(albumDir.$dPath)) + " " + style.keyword("permissions") + " changed to " + style.value(perm));
            // Try to update Plex library
            return updatePlexLib();
        })
        .then((result) => {
            if (result) {
                console.log(result);
                console.log(style.prompt('> ') + "Album added correctly!");
            }
        })
        .catch((e) => {
            console.log(style.error("Something went wrong: ") + e.message);
        });
        resolve();
    });
}

function updateParentFolder(path: string, perm: number | string, user: string, group: string) : Promise<any> {
    const chmod = require('chmod');
    const chown = require('chown');

    return new Promise((resolve, reject) => {
        chmod(path, perm, (e: Error) => {
            if (e) reject(e);
            else {
                let userid = require('userid');
                let uid = userid.uid(user);
                let gid = userid.gid(group);
                chown(path, uid, gid, (e: Error) => {
                    if (e) reject(e);
                    resolve(null);
                });
            }
        })
    });
}

function updatePlexLib() : Promise<any> {
    let config = require('config');
    return new Promise((resolve, reject) => {
        if (config.has('Plex.authToken')) {
            let plexAuthToken = config.get('Plex.authToken');
            let plex = new Plex("PlexPi", plexAuthToken);
            plex.updateLibray().then((result) => {
                resolve(style.prompt('> ') + "Plex Music Library update triggered.");
            })
            .catch((e) => {
                reject(e);
            });
        } else {
            resolve(null);
        }
    });
}