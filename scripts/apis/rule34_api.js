class Rule34API {
    async rule34_result(global_context, args) {
        //Get front page for tag
        var siteUrl0 = "https://rule34.xxx/index.php?page=post&s=list" + (args.length > 0 ? "&tags=" + args.join("+") : "");

        //Get banned tags
        var bannedTags = [];
        args.forEach(function(arg) {
            if(arg.startsWith("!")) {
                bannedTags.push(arg.replace("!", ""));
            }
        });

        //Get starting and last page for this tag
        var result0 = await global_context.modules.axios.get(siteUrl0);
        var $0 = await global_context.modules.cheerio.load(result0.data);

        var pages = [];
        var nextPage = null;
        var lastPage = null;

        var navigationElemets = $0(".pagination").children();
        navigationElemets.each(function () {
            var child = $0(this);

            var alt = child.attr("alt");

            switch(alt) {
                case "next":
                    nextPage = child;
                    break;

                case "last page":
                    lastPage = child;
                    break;
            }
        });

        //Check if there are results
        if(nextPage == null || lastPage == null) {
            var failed = {
                status: 0
            }

            return failed;
        }

        //Calculate page links from startID to endID
        var currentID = 0;

        var endingLink = lastPage.attr("href");
        var endingID = parseInt(endingLink.substring(endingLink.indexOf("pid=") + "pid=".length));

        //console.log("Getting pages(start: " + currentID + ", end: " + endingID + ") for tag(tag: " + args.join("+") + ")...");

        while(currentID <= endingID) {
            pages.push("?page=post&s=list" + (args.length > 0 ? "&tags=" + args.join("+") : "") + "&pid=" + currentID);

            currentID += 42;
        }

        //Get number of tries
        var numOfResultPages = pages.length;
        var numOfTries = 5;
        var triesCount = 1;

        while(triesCount <= numOfTries) {
            //Gets a random page
            var pageResultNumber = Math.floor(Math.random() * numOfResultPages) + 1;
            var page = pages[pageResultNumber - 1];

            //console.log("Searching the page(num:" + pageResultNumber + ")- Try(" + triesCount + "/" + numOfTries + ")...");

            //Get results from target page of tag
            var siteUrl1 = "https://rule34.xxx/index.php" + page;
            var result1 = await global_context.modules.axios.get(siteUrl1);
            var $1 = await global_context.modules.cheerio.load(result1.data);

            var postLinks = [];

            //Get links to posts
            $1(".preview").each(function () {
                var preview = $1(this);
                var parent = preview.parent();
                var href = parent.attr("href");
                var tagsAttr = preview.attr("alt");
                var tags = tagsAttr.split(" ");

                //Check banned tags
                var valid = true;

                bannedTags.forEach(function(tag) {
                    if(tags.includes(tag)) {
                        valid = false;
                    }
                });

                if(valid === true) {
                    postLinks.push("https://rule34.xxx/" + href);
                }
            });

            if(postLinks.length > 1) {
                //Get random link from results
                var numOfPostLinks = postLinks.length;
                var postLinkNumber = Math.floor(Math.random() * numOfPostLinks) + 1;

                var postlink = postLinks[postLinkNumber - 1];

                //Get postInfo from the post
                const result2 = await global_context.modules.axios.get(postlink);
                var $2 = await global_context.modules.cheerio.load(result2.data);

                var image = $2("#image");
                var imageLink = image.attr("src");
                var tagsAttr2 = image.attr("alt");
                var tags2 = tagsAttr2.split(" ");

                //Construct object
                var postInfo = {
                    status: 1,
                    link: imageLink,
                    pageNumber: pageResultNumber,
                    numOfPages: numOfResultPages,
                    postNumber: postLinkNumber,
                    numOfPosts: numOfPostLinks,
                    postTags: tags2
                }

                //Return object with postInfo
                return postInfo;
            }

            triesCount += 1;
        }

        //Failed because system ran out of tries
        var failed2 = {
            status: 2
        }

        return failed2;
    }
}

module.exports = Rule34API;