class SafebooruAPI {
    constructor(_cheerio, _axios, _xmlconvert) {
        this.cheerio = _cheerio;
        this.axios = _axios;
        this.xmlconvert = _xmlconvert;
    }

    async safebooru_result(ws, args) {
        //Get front page for tag
        var siteUrl0A = "https://safebooru.org/index.php?page=dapi&s=post&q=index&tags=" + (args.length > 0 ? args.join("+") : "") + "&limit=1";
        var result0A = await ws.axios.get(siteUrl0A).catch(e => { console.log(e); return { status: -1 }; })
        var json0 = JSON.parse(ws.xmlconvert.xml2json(result0A.data));

        var pages = Math.ceil(json0.elements[0].attributes.count / 100) - 1;
        var pageIndex = Math.floor(Math.random() * pages) + 1;

        //Get front page for tag
        var siteUrl0 = "https://safebooru.org/index.php?page=dapi&s=post&q=index&tags=" + (args.length > 0 ? args.join("+") : "") + "&pid=" + (pageIndex - 1);

        //Get starting and last page for this tag
        var result0 = await ws.axios.get(siteUrl0).catch(e => { console.log(e); return { status: -1 }; })
        var json = JSON.parse(ws.xmlconvert.xml2json(result0.data));

        var numOfPosts = json0.elements[0].attributes.count > 100 ? 100 : json0.elements[0].attributes.count;
        var postIndex = Math.floor(Math.random() * numOfPosts) + 1;
        if(json.elements[0].elements == null) { return { status: 0 } }

        var post = json.elements[0].elements[postIndex]

        //Construct object
        var postInfo = {
            status: 1,
            link: post.attributes.file_url,
            pageNumber: pageIndex,
            numOfPages: pages + 1,
            postNumber: postIndex,
            numOfPosts: json0.elements[0].attributes.count,
            postTags: post.attributes.tags
        }

        //Return object with postInfo
        return postInfo;
    }
}

module.exports = SafebooruAPI;