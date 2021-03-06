/* Types */
import { GlobalContext } from "../../ts/base";

/* Node Imports */
import { load } from "cheerio";
import axios from "axios";

export async function nhentai_result(global_context: GlobalContext, args: string[]) {
    const site_url_main = `https://nhentai.net/g/${args}`;
    const result_main = await axios.get(site_url_main, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch((e: Error) => {
        global_context.logger.neko_api_error(e);
        return null;
    });
    if (result_main === null || result_main.data === undefined) {
        return null;
    }
    const $0 = await load(result_main.data);

    const result_html = $0("#info").html();
    if (result_html === null) {
        return null;
    }
    const title = result_html.substring(result_html.indexOf('<span class="pretty">') + '<span class="pretty">'.length, result_html.indexOf("</span>", result_html.indexOf('<span class="pretty">')));
    const num_of_pages = result_html.substring(result_html.indexOf('<span class="name">', result_html.indexOf("Pages:")) + '<span class="name">'.length, result_html.indexOf("</span>", result_html.indexOf("Pages:")));
    const all_tags: string[] = [];
    const all_languages: string[] = [];
    let all_favourites;

    $0(".tag").each(function (this) {
        const tag = $0(this);
        const href = tag.attr("href");
        if (href !== undefined && href.includes("/tag/")) {
            all_tags.push(href.replace("/tag/", "").replace("/", ""));
        } else if (href !== undefined && href.includes("/language/")) {
            all_languages.push(href.replace("/language/", "").replace("/", ""));
        }
    });

    $0(".nobold").each(function (this) {
        const all_favourites_html = $0(this).html();
        all_favourites = all_favourites_html === null ? 0 : all_favourites_html.replace("(", "").replace(")", "");
    });

    const post_info = {
        status: 1,
        title: title,
        num_of_pages: num_of_pages,
        tags: all_tags,
        languages: all_languages,
        favourites: all_favourites,
    };

    return post_info;
}
