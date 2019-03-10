export class Album {
    private artist: string;
    private title: string;
    private year: string;

	constructor($artist: string, $title: string, $year: string) {
        this.artist = $artist;
        this.title = $title;
		this.year = $year;
	}

    /**
     * Getter $title
     * @return {string}
     */
	public get $title(): string {
		return this.title;
	}

    /**
     * Setter $title
     * @param {string} value
     */
	public set $title(value: string) {
		this.title = value;
	}

    /**
     * Getter $artist
     * @return {string}
     */
	public get $artist(): string {
		return this.artist;
	}

    /**
     * Setter $artist
     * @param {string} value
     */
	public set $artist(value: string) {
		this.artist = value;
	}

    /**
     * Getter $year
     * @return {string}
     */
	public get $year(): string {
		return this.year;
	}

    /**
     * Setter $year
     * @param {string} value
     */
	public set $year(value: string) {
		this.year = value;
    } 

}