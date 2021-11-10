/* Types */
import { GlobalContext } from "../../ts/base";

/* Node Imports */
import axios from "axios";

/* Local Imports */
import { pick_random } from "../../scripts/utils/util_general";

export async function danbooru_result(global_context: GlobalContext, args: string[]) {
    const site_url_pages = `https://danbooru.donmai.us/posts?tags=${args.length > 0 ? args.join("+") : ""}&limit=1`;
    const result_pages = await axios.get(site_url_pages, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch((e: Error) => {
        global_context.logger.neko_api_error(e);
        return null;
    });
    if (result_pages === null || result_pages.data === undefined) {
        return null;
    }

    const pages_navigator = result_pages.data.lastIndexOf('class="paginator-page desktop-only" hidden=');
    const pages = parseInt(result_pages.data.substring(result_pages.data.indexOf(">", pages_navigator) + 1, result_pages.data.indexOf("<", pages_navigator)));
    let page_index = 1001;
    while (page_index > 1000) {
        page_index = Math.floor(Math.random() * pages) + 1;
    }

    const site_url_main = `https://danbooru.donmai.us/posts?page=${page_index}&tags=${args.length > 0 ? args.join("+") : ""}&limit=1`;
    const result_main = await axios.get(site_url_main, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch((e: Error) => {
        global_context.logger.neko_api_error(e);
        return null;
    });
    if (result_main === null || result_main.data === undefined) {
        return null;
    }

    const posts = [];
    let i = 0;
    while (result_main.data.indexOf('data-id="', i) > 0) {
        const i_2 = result_main.data.indexOf('data-id="', i) + 'data-id="'.length;
        const post_ID = result_main.data.substring(i_2, result_main.data.indexOf('"', i_2));
        posts.push(post_ID);

        i = i_2;
    }

    const post_ID = pick_random(posts);
    const site_url_post = `https://danbooru.donmai.us/posts/${post_ID}.json`;
    const result_post = await axios.get(site_url_post, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch((e: Error) => {
        global_context.logger.neko_api_error(e);
        return null;
    });
    if (result_post === null || result_post.data === undefined) {
        return null;
    }

    const post_info = {
        status: 1,
        link: result_post.data.file_url,
        page_number: page_index,
        num_of_pages: pages + 1,
        post_number: page_index,
        num_of_posts: pages + 1,
        post_tags: result_main.data.tag_string,
    };

    return post_info;
}
