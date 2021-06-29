class E621API {
    async e621_result(global_context, args) {
        //Get front page for tag
        var siteUrl0A = "https://e621.net/posts?tags=" + (args.length > 0 ? args.join("+") : "") + "&limit=1";
        var result0A = await global_context.modules.axios.get(siteUrl0A, { headers: { "Cookie": "gw=seen;" } }).catch(e => { console.log(e); return { status: -1 }; });

        var a = result0A.data.lastIndexOf('a href="/posts?limit=1')
        var pages = parseInt(result0A.data.substring(result0A.data.indexOf(">", a) + 1, result0A.data.indexOf("<", a)));
        var pageIndex = 1001;
        while(pageIndex > 1000) {
            pageIndex = Math.floor(Math.random() * pages) + 1;
        }

        //Get front page for tag
        var siteUrl0 = "https://e621.net/posts?page=" + pageIndex + "&tags=" + (args.length > 0 ? args.join("+") : "") + "&limit=20";
        var result0 = await global_context.modules.axios.get(siteUrl0, { headers: { "Cookie": "gw=seen;" } }).catch(e => { console.log(e); return { status: -1 }; })
        if(result0.data === undefined) { return { status: 0 }; }

        let posts = [];
        let i = 0;
        while(result0.data.indexOf('data-id="', i) > 0) {
            let i2 = result0.data.indexOf('data-id="', i) + 'data-id="'.length;
            let postID = result0.data.substring(i2, result0.data.indexOf('"', i2))
            posts.push(postID);
            i = i2;
        }

        var postIndex = Math.floor(Math.random() * posts.length) + 1;
        var postID = posts[postIndex];

        //Get front page for tag
        var siteUrl1 = "https://e621.net/posts/" + postID + ".json";
        var result1 = await global_context.modules.axios.get(siteUrl1, { headers: { "Cookie": "gw=seen;" } }).catch(e => { console.log(e); return { status: 0 }; })
        if(result1.data === undefined) { return { status: 0 }; }

        //Construct object
        var postInfo = {
            status: 1,
            link: result1.data.post.file.url,
            pageNumber: pageIndex,
            numOfPages: pages + 1,
            postNumber: postIndex,
            numOfPosts: (pages + 1) * 20,
            postTags: result0.data.tags
        }

        //Return object with postInfo
        return postInfo;
    }
}

module.exports = E621API;