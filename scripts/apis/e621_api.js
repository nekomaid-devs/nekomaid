class E621API {
    async e621_result(global_context, args) {
        let site_url_pages = `https://e621.net/posts?tags=${(args.length > 0 ? args.join("+") : "")}&limit=1`;
        let result_pages = await global_context.modules.axios.get(site_url_pages, { headers: { "Cookie": "gw=seen;", "User-Agent": "Nekomaid/2.0" } }).catch(e => { global_context.logger.neko_api_error(e); });
        if(result_pages.data === undefined) { return { status: -1 }; }

        let pages_navigator = result_pages.data.lastIndexOf('a href="/posts?limit=1')
        let pages = parseInt(result_pages.data.substring(result_pages.data.indexOf(">", pages_navigator) + 1, result_pages.data.indexOf("<", pages_navigator)));
        let page_index = 1001;
        while(page_index > 1000) {
            page_index = Math.floor(Math.random() * pages) + 1;
        }

        let site_url_main = `https://e621.net/posts?page=${page_index}&tags=${(args.length > 0 ? args.join("+") : "")}&limit=1`;
        let result_main = await global_context.modules.axios.get(site_url_main, { headers: { "Cookie": "gw=seen;", "User-Agent": "Nekomaid/2.0" } }).catch(e => { global_context.logger.neko_api_error(e); })
        if(result_main === undefined || result_main.data === undefined) { return { status: -1 }; }

        let posts = [];
        let i = 0;
        while(result_main.data.indexOf('data-id="', i) > 0) {
            let i_2 = result_main.data.indexOf('data-id="', i) + 'data-id="'.length;
            let post_ID = result_main.data.substring(i_2, result_main.data.indexOf('"', i_2))
            posts.push(post_ID);

            i = i_2;
        }

        let post_ID = global_context.utils.pick_random(posts);
        let site_url_post = `https://e621.net/posts/${post_ID}.json`;
        let result_post = await global_context.modules.axios.get(site_url_post, { headers: { "Cookie": "gw=seen;", "User-Agent": "Nekomaid/2.0" } }).catch(e => { global_context.logger.neko_api_error(e); })
        if(result_post === undefined || result_post.data === undefined) { return { status: -1 }; }

        let post_info = {
            status: 1,
            link: result_post.data.post.file.url,
            page_number: page_index,
            num_of_pages: pages + 1,
            post_number: page_index,
            num_of_posts: pages + 1,
            post_tags: result_main.data.tags
        }

        return post_info;
    }
}

module.exports = E621API;