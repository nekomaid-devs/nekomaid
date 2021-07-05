class OsuAPI {
    async osunews_result(ws) {
        //Get front page for tag
        var siteUrl0 = "https://osu.ppy.sh/home/news";

        //Get starting and last page for this tag
        var result0 = await ws.got(siteUrl0).catch(function() {
            var failed = {
                status: 0
            }

            return failed;
        })

        //Construct object
        var newsHTML = result0.body.substring(result0.body.indexOf('<script id="json-index" type="application/json">') + '<script id="json-index" type="application/json">'.length, result0.body.indexOf('</script>', result0.body.indexOf('<script id="json-index" type="application/json">')));
        
        var posts = []

        while(newsHTML.indexOf('{', 1) > -1) {
            var postTime = newsHTML.substring(newsHTML.indexOf('"published_at":"') + '"published_at":"'.length, newsHTML.indexOf('"', newsHTML.indexOf('"published_at":"') + '"published_at":"'.length));
            var postTitle = newsHTML.substring(newsHTML.indexOf('"title":"') + '"title":"'.length, newsHTML.indexOf('"', newsHTML.indexOf('"title":"') + '"title":"'.length));
            var postDescription = newsHTML.substring(newsHTML.indexOf('"preview":"') + '"preview":"'.length, newsHTML.indexOf('"', newsHTML.indexOf('"preview":"') + '"preview":"'.length));
            var postAuthor = newsHTML.substring(newsHTML.indexOf('"author":"') + '"author":"'.length, newsHTML.indexOf('"', newsHTML.indexOf('"author":"') + '"author":"'.length));
            var postPreview = newsHTML.substring(newsHTML.indexOf('"first_image":"') + '"first_image":"'.length, newsHTML.indexOf('"', newsHTML.indexOf('"first_image":"') + '"first_image":"'.length));

            var link = postPreview.split('\\').join('');

            var postInfo = {
                status: 1,
                id: require('crypto').createHash('md5')
                .update(postDescription)
                .digest("hex"),
                title: postTitle,
                time: postTime,
                description: postDescription,
                author: postAuthor,
                preview: link.startsWith("https://") === false ? "https://osu.ppy.sh/" + link : link
            }

            newsHTML = newsHTML.replace(newsHTML.substring(newsHTML.indexOf('{', 1), newsHTML.indexOf('}') + 1), "");

            posts.push(postInfo);
        }

        return posts;
    }

    async osuchangelog_result(ws) {
        //Get front page for tag
        var siteUrl0 = "https://osu.ppy.sh/home/changelog";

        //Get starting and last page for this tag
        var result0 = await ws.got(siteUrl0).catch(function() {
            var failed = {
                status: 0
            }

            return failed;
        })

        //Construct object
        var newsHTML = result0.body.substring(result0.body.indexOf('<script id="json-index" type="application/json">') + '<script id="json-index" type="application/json">'.length, result0.body.indexOf('</script>', result0.body.indexOf('<script id="json-index" type="application/json">')));

        var posts = []

        while(newsHTML.indexOf('{', 1) > -1) {
            var postTime = newsHTML.substring(newsHTML.indexOf('"created_at":"') + '"created_at":"'.length, newsHTML.indexOf('"', newsHTML.indexOf('"created_at":"') + '"created_at":"'.length));
            var postName = newsHTML.substring(newsHTML.indexOf('"display_name":"') + '"display_name":"'.length, newsHTML.indexOf('"', newsHTML.indexOf('"display_name":"') + '"display_name":"'.length));
            var postVersion = newsHTML.substring(newsHTML.indexOf('"display_version":"') + '"display_version":"'.length, newsHTML.indexOf('"', newsHTML.indexOf('"display_version":"') + '"display_version":"'.length));
            var postTitle = postName + " " + postVersion;

            var object = newsHTML.substring(newsHTML.indexOf('{', newsHTML.indexOf('"builds":[{')), newsHTML.indexOf(']}', newsHTML.indexOf('"builds":[{') + 2));
            var count = (object.match(/"type":"fix"/g) || []).length;
            var count2 = (object.match(/"type":"add"/g) || []).length;

            var postInfo = {
                status: 1,
                id: require('crypto').createHash('md5')
                .update(postVersion)
                .digest("hex"),
                title: postTitle,
                time: postTime,
                version: postVersion,
                name: postName,
                numOfChanges: count,
                numOfAdditions: count2
            }

            newsHTML = newsHTML.replace(object, "");

            posts.push(postInfo);
        }
        
        //https://qtlamkas.why-am-i-he.re/hGvOeK.png

        return posts;
    }

    async osuscores_result(ws) {
        var posts = await ws.snoo.getSubreddit('osugame').getNewComments();
        return posts;
    }
}

module.exports = OsuAPI