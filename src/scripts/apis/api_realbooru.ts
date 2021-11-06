/* Types */
import { GlobalContext } from "../../ts/base";

/* Node Imports */
import { load } from "cheerio";

class RealbooruAPI {
    async realbooru_result(global_context: GlobalContext, args: string[]) {
        const site_url_main = `https://realbooru.com/index.php?page=post&s=list${args.length > 0 ? `&tags=${args.join("+")}` : ""}`;
        const result_main = await global_context.modules.axios.get(site_url_main, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch((e: Error) => {
            global_context.logger.neko_api_error(e);
        });
        if (result_main === undefined || result_main.data === undefined) {
            return { status: -1 };
        }
        const $0 = await load(result_main.data);

        const pages = [];
        let next_page: any = null;
        let last_page: any = null;

        const navigation_elements = $0(".pagination").children();
        navigation_elements.each(function (this) {
            const child = $0(this);
            const alt = child.attr("alt");

            switch (alt) {
                case "next":
                    next_page = child;
                    break;

                case "last page":
                    last_page = child;
                    break;
            }
        });

        if (next_page === null || last_page === null) {
            return { status: -1 };
        }

        let current_ID = 0;
        const ending_link = last_page.attr("href");
        const ending_ID = parseInt(ending_link.substring(ending_link.indexOf("pid=") + "pid=".length));
        while (current_ID <= ending_ID) {
            pages.push(`?page=post&s=list${args.length > 0 ? `&tags=${args.join("+")}` : ""}&pid=${current_ID}`);
            current_ID += 42;
        }

        const num_of_tries = 5;
        let current_tries = 1;
        while (current_tries <= num_of_tries) {
            const page = global_context.utils.pick_random(pages);

            const site_url_posts = `https://realbooru.com/index.php${page}`;
            const result_posts = await global_context.modules.axios.get(site_url_posts, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch((e: Error) => {
                global_context.logger.neko_api_error(e);
            });
            if (result_posts === undefined || result_posts.data === undefined) {
                return { status: -1 };
            }
            const $1 = await load(result_posts.data);

            const post_links: any[] = [];
            $1(".col").each(function (this) {
                const preview = $1(this);
                let href;
                preview.children().each(function (this) {
                    href = $1(this).attr("href");
                });
                /*
                 *let tags_attr = -1;
                 *preview.children().each(function() {
                 *  $1(this).children().each(function() {
                 *      tags_attr = $1(this).attr("title");
                 *  });
                 *});
                 *let tags = tags_attr.split(", ");
                 */

                post_links.push(href);
            });

            if (post_links.length > 1) {
                const site_url_post = global_context.utils.pick_random(post_links);
                const result_post = await global_context.modules.axios.get(site_url_post, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch((e: Error) => {
                    global_context.logger.neko_api_error(e);
                });
                if (result_post === undefined || result_post.data === undefined) {
                    return { status: -1 };
                }
                const $2 = await load(result_post.data);

                const image = $2("#image");
                const image_link = image.attr("src");

                const tags_attr = image.attr("alt");
                const tags = tags_attr === undefined ? [] : tags_attr.split(" ");

                const page_number = pages.indexOf(page);
                const post_info = {
                    status: 1,
                    link: image_link,
                    page_number: pages.indexOf(page),
                    num_of_pages: pages.length,
                    post_number: page_number * 42 + post_links.indexOf(site_url_post),
                    num_of_posts: pages.length * 42,
                    post_tags: tags
                };

                return post_info;
            }

            current_tries += 1;
        }

        return { status: -1 };
    }
}

export default RealbooruAPI;
