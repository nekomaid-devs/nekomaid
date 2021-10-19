class SafebooruAPI {
    async safebooru_result(global_context, args) {
        let site_url_pages = `https://safebooru.org/index.php?page=dapi&s=post&q=index&tags=${args.length > 0 ? args.join("+") : ""}&limit=1`;
        let result_pages = await global_context.modules.axios.get(site_url_pages, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch((e) => {
            global_context.logger.neko_api_error(e);
        });

        let pages_navigator = JSON.parse(global_context.modules.xmlconvert.xml2json(result_pages.data));
        let pages = pages_navigator.elements[0].attributes.count - 1;
        let page_index = Math.floor(Math.random() * pages) + 1;

        let site_url_main = `https://safebooru.org/index.php?page=dapi&s=post&q=index&tags=${args.length > 0 ? args.join("+") : ""}&limit=1&pid=${page_index - 1}`;
        let result_main = await global_context.modules.axios.get(site_url_main, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch((e) => {
            global_context.logger.neko_api_error(e);
        });

        let posts = JSON.parse(global_context.modules.xmlconvert.xml2json(result_main.data));
        if (posts.elements[0].elements === undefined || posts.elements[0].elements.length < 1) {
            return { status: -1 };
        }
        let result_post = posts.elements[0].elements[0];

        let post_info = {
            status: 1,
            link: result_post.attributes.file_url,
            page_number: page_index,
            num_of_pages: pages + 1,
            post_number: page_index,
            num_of_posts: pages + 1,
            post_tags: result_post.attributes.tags,
        };

        return post_info;
    }
}

module.exports = SafebooruAPI;
