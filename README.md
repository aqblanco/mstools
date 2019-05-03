# Media Server Tools
[![Maintainability](https://api.codeclimate.com/v1/badges/f8bebf9e190c45c29451/maintainability)](https://codeclimate.com/github/aqblanco/mstools/maintainability)

Time saving shortcuts for common operations on my media server. It will allow the extraction, permissions and owner change and name cleaning of a zipped album using a single command. Right now it's only working with a very concrete naming pattern.

## Installation:
`$ git clone https://github.com/aqblanco/mstools.git`

`$ cd mstools/`

`$ npm install`

`$ gulp`

For it to work you will also need a configuration file named */default.json* created under a */config/* directory on the project root, using the following template:

```
{
    "Extraction": {
        "user": "ownername",
        "group": "groupname",
        "permissions": "774",
        "outputBaseDir": "../test/"
    },
    "Plex": {
        "authToken": "yourPlexToken"
    }
}
```
Note that Plex auth token is only necessary in order to update music libraries when finished an extraction.

## Basic Usage:

`$ mstools extract filename.7z`

You can also especify the output folder using the '-o' option, as it follows:

`$ mstools extract filename.7z -o /path/to/output/folder/`
