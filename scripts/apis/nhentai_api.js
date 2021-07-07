class NHentaiAPI {
    async nhentai_result(global_context, args) {
        let site_url_main = `https://nhentai.net/g/${args}`;
        let result_main = await global_context.modules.axios.get(site_url_main, { headers: { "User-Agent": "Nekomaid/2.0" } }).catch(e => { global_context.logger.neko_api_error(e); })
        let $0 = await global_context.modules.cheerio.load(result_main.data);

        let result_html = $0("#info").html();
        let title = result_html.substring(result_html.indexOf('<span class="pretty">') + '<span class="pretty">'.length, result_html.indexOf('</span>', result_html.indexOf('<span class="pretty">')));
        let num_of_pages = result_html.substring(result_html.indexOf('<span class="name">', result_html.indexOf("Pages:")) + '<span class="name">'.length, result_html.indexOf('</span>', result_html.indexOf("Pages:")));
        let all_tags = [];
        let all_languages = [];
        let all_favourites = 0;

        $0(".tag").each(function () {
            let tag = $0(this);
            let href = tag.attr("href");
            if(href.includes("/tag/")) {
                all_tags.push(href.replace("/tag/", "").replace("/", ""));
            } else if(href.includes("/language/")) {
                all_languages.push(href.replace("/language/", "").replace("/", ""));
            }
        });

        $0(".nobold").each(function() {
            all_favourites = $0(this).html().replace("(", "").replace(")", "");
        })

        let post_info = {
            status: 1,
            title: title,
            num_of_pages: num_of_pages,
            tags: all_tags,
            languages: all_languages,
            favourites: all_favourites
        }

        return post_info;
    }
}

module.exports = NHentaiAPI