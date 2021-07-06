class Rule34API {
    async rule34_result(global_context, args) {
        // TODO: redirect errors into their own logger
        let site_url_main = `https://rule34.xxx/index.php?page=post&s=list${(args.length > 0 ? "&tags=" + args.join("+") : "")}`;
        let result_main = await global_context.modules.axios.get(site_url_main, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch(e => { global_context.logger.error(e); })
        if(result_main === undefined || result_main.data === undefined) { return { status: -1 }; }
        let $0 = await global_context.modules.cheerio.load(result_main.data);

        let pages = [];
        let next_page = -1;
        let last_page = -1;

        let navigation_elements = $0(".pagination").children();
        navigation_elements.each(function() {
            let child = $0(this);
            let alt = child.attr("alt");

            switch(alt) {
                case "next":
                    next_page = child;
                    break;

                case "last page":
                    last_page = child;
                    break;
            }
        });

        if(next_page === -1 || last_page === -1) {
            return { status: -1 };
        }

        let current_ID = 0;
        let ending_link = last_page.attr("href");
        let ending_ID = parseInt(ending_link.substring(ending_link.indexOf("pid=") + "pid=".length));
        while(current_ID <= ending_ID) {
            pages.push(`?page=post&s=list${(args.length > 0 ? "&tags=" + args.join("+") : "")}&pid=${current_ID}`);
            current_ID += 42;
        }

        let num_of_tries = 5;
        let current_tries = 1;
        while(current_tries <= num_of_tries) {
            let page = global_context.utils.pick_random(pages);

            let site_url_posts = `https://rule34.xxx/index.php${page}`;
            let result_posts = await global_context.modules.axios.get(site_url_posts, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch(e => { global_context.logger.error(e); })
            if(result_posts === undefined || result_posts.data === undefined) { return { status: -1 }; }
            let $1 = await global_context.modules.cheerio.load(result_posts.data);

            let post_links = [];
            $1(".preview").each(function() {
                let preview = $1(this);
                let parent = preview.parent();
                let href = parent.attr("href");
                let tags_attr = preview.attr("alt");
                let tags = tags_attr.split(" ");

                post_links.push(`https://rule34.xxx/${href}`);
            });

            if(post_links.length > 1) {
                let site_url_post = global_context.utils.pick_random(post_links);
                let result_post = await global_context.modules.axios.get(site_url_post, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch(e => { global_context.logger.error(e); })
                if(result_post === undefined || result_post.data === undefined) { return { status: -1 }; }
                let $2 = await global_context.modules.cheerio.load(result_post.data);

                let image = $2("#image");
                let image_link = image.attr("src");

                let tags_attr = image.attr("alt");
                let tags = tags_attr.split(" ");

                let page_number = pages.indexOf(page);
                let post_info = {
                    status: 1,
                    link: image_link,
                    page_number: pages.indexOf(page),
                    num_of_pages: pages.length,
                    post_number: page_number * 42 + post_links.indexOf(site_url_post),
                    num_of_posts: pages.length * 42,
                    post_tags: tags
                }

                return post_info;
            }

            current_tries += 1;
        }

        return { status: -1 };
    }
}

module.exports = Rule34API;