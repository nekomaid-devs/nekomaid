class NHentaiAPI {
    constructor(_cheerio, _axios) {
        this.cheerio = _cheerio;
        this.axios = _axios;
    }
    
    async nhentai_result(ws, input) {
        //Get front page for tag
        var siteUrl0 = "https://nhentai.net/g/" + input;

        //Get starting and last page for this tag
        var result0 = await ws.axios.get(siteUrl0).catch(function() {
            var failed = {
                status: 0
            }

            return failed;
        })

        var $0 = await ws.cheerio.load(result0.data);

        //Construct object
        var infoHtml = $0("#info").html();
        var titleHTML = infoHtml.substring(infoHtml.indexOf('<span class="pretty">') + '<span class="pretty">'.length, infoHtml.indexOf('</span>', infoHtml.indexOf('<span class="pretty">')));
        var allTags = [];
        var allLanguages = [];
        var allFavourites = 0;

        $0(".tag").each(function () {
            var tag = $0(this);
            var href = tag.attr("href");
            if(href.includes("/tag/")) {
                allTags.push(
                    href
                    .replace("/tag/", "")
                    .replace("/", ""))
            } else if(href.includes("/language/")) {
                allLanguages.push(
                    href
                    .replace("/language/", "")
                    .replace("/", ""))
            }
        });

        $0(".nobold").each(function() {
            allFavourites = $0(this).html()
            .replace("(", "")
            .replace(")", "");
        })

        var postInfo = {
            status: 1,
            title: titleHTML,
            numOfPages: infoHtml.substring(infoHtml.indexOf('<span class="name">', infoHtml.indexOf("Pages:")) + '<span class="name">'.length, infoHtml.indexOf('</span>', infoHtml.indexOf("Pages:"))),
            tags: allTags,
            languages: allLanguages,
            favourites: allFavourites
        }

        //Return object with postInfo
        return postInfo;
    }
}

module.exports = NHentaiAPI