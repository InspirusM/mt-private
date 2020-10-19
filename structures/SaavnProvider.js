const { raw } = require("express");

const searchBase = "https://www.jiosaavn.com/api.php?__call=autocomplete.get&_format=json&_marker=0&cc=in&includeMetaTags=1&query=";
const songBase = "https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=";

class SaavnProvider {
    constructor(client) {
        this.client = client;
    }

   async search(title) {
      const search = await this.client.snek.get(searchBase + title);

      const rawSong = (search.data.songs);

       if(rawSong.data === undefined) return 'No results found';
       else return rawSong.data
    }

    async songInfo(id) {
        const search = await this.client.snek.get(songBase + id);

        const songRaw = JSON.stringify(search.data);

        if(!songRaw) return 'No results found';

        const replaceID = songRaw.replace(id, "hydrox");

        const replaceMediaURLText = replaceID.replace('media_preview_url', 'media_url');

        const replaceMediaURL = replaceMediaURLText.replace('preview.saavncdn.com', 'aac.saavncdn.com');

        const replaceQualityStream = replaceMediaURL.replace('_96_p', '_320');

        const imgQuality = replaceQualityStream.replace('150x150', '500x500');

        const ampr = imgQuality.replace(/amp&;/gi, "&");

        const copr = ampr.replace(/&copy;/gi, "©");

        const result = JSON.parse(copr);
        
        return result.hydrox;
    }
};

module.exports = SaavnProvider;