class DanbooruAPI {
    async danbooru_result(global_context, args) {
        //Get front page for tag
        var siteUrl0A = "https://danbooru.donmai.us/posts?tags=" + (args.length > 0 ? args.join("+") : "") + "&limit=1";
        var result0A = await global_context.modules.axios.get(siteUrl0A).catch(e => { console.log(e); return { status: -1 }; })

        var a = result0A.data.lastIndexOf('class="paginator-page desktop-only" hidden=')
        var pages = parseInt(result0A.data.substring(result0A.data.indexOf(">", a) + 1, result0A.data.indexOf("<", a)));
        var pageIndex = 1001;
        while(pageIndex > 1000) {
            pageIndex = Math.floor(Math.random() * pages) + 1;
        }

        //Get front page for tag
        var siteUrl0 = "https://danbooru.donmai.us/posts?page=" + pageIndex + "&tags=" + (args.length > 0 ? args.join("+") : "") + "&limit=20";
        var result0 = await global_context.modules.axios.get(siteUrl0).catch(e => { console.log(e); return { status: -1 }; })
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
        var siteUrl1 = "https://danbooru.donmai.us/posts/" + postID + ".json";
        var result1 = await global_context.modules.axios.get(siteUrl1).catch(e => { console.log(e); return { status: 0 }; })
        if(result1.data === undefined) { return { status: 0 }; }

        //Construct object
        var postInfo = {
            status: 1,
            link: result1.data.file_url,
            pageNumber: pageIndex,
            numOfPages: pages + 1,
            postNumber: postIndex,
            numOfPosts: (pages + 1) * 20,
            postTags: result0.data.tag_string
        }

        //Return object with postInfo
        return postInfo;
    }
}

module.exports = DanbooruAPI;