export class Plex {
    private serverName: string;
    private serverIP: string;
    private authToken: string;

	constructor($serverName: string, $authToken: string) {
        this.serverName = $serverName;
        this.serverIP = "http://localhost";
		this.authToken = $authToken;
	}

    /**
     * Getter $serverName
     * @return {string}
     */
	public get $serverName(): string {
		return this.serverName;
	}

    /**
     * Setter $serverName
     * @param {string} value
     */
	public set $serverName(value: string) {
		this.serverName = value;
	}
    
    /**
     * Getter $authToken
     * @return {string}
     */
	public get $authToken(): string {
		return this.authToken;
	}

    /**
     * Setter $authToken
     * @param {string} value
     */
	public set $authToken(value: string) {
		this.authToken = value;
    }
    
    private getServerIP(): Promise<string> {
        const https = require('https');

        return new Promise((resolve, reject) => {
            let ip = "http://127.0.0.1";
            // TODO: save it in env config?
            // Do the request only if necessary
            if (this.serverIP == "") {
                https.get(`https://plex.tv/pms/resources/?X-Plex-Token=${this.authToken}&includeHttps=1`,
                    (resp: any) => {
                        let data = '';

                        // A chunk of data has been recieved.
                        resp.on('data', (chunk: string) => {
                            data += chunk;
                        });

                        resp.on('end', () => {
                            // Parse XML response
                            let parseString = require('xml2js').parseString;
                            parseString(data, (err: Error, result: any) => {
                                if (err) reject(err);
                                else {
                                    result.MediaContainer.Device.forEach((e: any) => {
                                        e = e['$'];
                                        if (e['name'] == this.serverName) ip = e['publicAddress'];
                                    });
                                    resolve(ip);
                                }
                            });
                        }); 
                    }
                ).on("error", (err: Error) => {
                    reject(err);
                });
            // Don't retrieve the IP again
            } else {
                resolve(ip);
            }  
        });
    }

    public updateLibray(): Promise<any> {
        const rp = require('request-promise-native');
        return new Promise((resolve, reject) => {
            let serverIP = "";
            this.getServerIP().then((ip: string) => {
                serverIP = ip;
                // Request to get the libraries info
                let librariesURL = `${serverIP}:32400/library/sections?X-Plex-Token=${this.authToken}`;
                return rp(librariesURL)
            })
            .then((data: string) => {
                // Parse XML response
                let xml2js = require('xml2js-es6-promise');
                return xml2js(data);
            })
            .then((result: any) => {
                // Requests to update the music libraries
                result.MediaContainer.Directory.forEach((e: any) => {
                    e = e['$'];
                    if(e.type == 'artist') {
                        let scanningURL = `${serverIP}:32400/library/sections/${e.key}/refresh?X-Plex-Token=${this.authToken}`;
                        rp(scanningURL).then((data: string) => {
                            resolve(data);
                        })
                    }
                });
                resolve();
            })
            .catch((err: Error) => {
                reject(err);
            });      
        })
    }
}