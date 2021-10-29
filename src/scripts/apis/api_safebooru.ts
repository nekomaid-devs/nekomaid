import { GlobalContext } from "../../ts/types";

class SafebooruAPI {
    async safebooru_result(global_context: GlobalContext, args: string[]) {
        const site_url_pages = `https://safebooru.org/index.php?page=dapi&s=post&q=index&tags=${args.length > 0 ? args.join("+") : ""}&limit=1`;
        const result_pages = await global_context.modules.axios.get(site_url_pages, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch((e: Error) => {
            global_context.logger.neko_api_error(e);
        });

        const pages_navigator = JSON.parse(global_context.modules.xmlconvert.xml2json(result_pages.data));
        const pages = pages_navigator.elements[0].attributes.count - 1;
        const page_index = Math.floor(Math.random() * pages) + 1;

        const site_url_main = `https://safebooru.org/index.php?page=dapi&s=post&q=index&tags=${args.length > 0 ? args.join("+") : ""}&limit=1&pid=${page_index - 1}`;
        const result_main = await global_context.modules.axios.get(site_url_main, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch((e: Error) => {
            global_context.logger.neko_api_error(e);
        });

        const posts = JSON.parse(global_context.modules.xmlconvert.xml2json(result_main.data));
        if (posts.elements[0].elements === undefined || posts.elements[0].elements.length < 1) {
            return { status: -1 };
        }
        const result_post = posts.elements[0].elements[0];

        const post_info = {
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

export default SafebooruAPI;
