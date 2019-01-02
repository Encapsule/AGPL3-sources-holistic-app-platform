// app-site-static-metadata-declaration.js

const siteThemeData = require('../view/theme');

module.exports = {
    organization: {
        name: "Encapsule Project",
        location: "Seattle WA",
        url: "https://encapsule.io",
        social: {
            twitterUrl: "https://twitter.com/Encapsule",
            githubUrl: "https://github.com/Encapsule"
        },
        copyrightHolder: {
            name: "Chris Russell",
            twitterUrl: "https://twitter.com/AlpineLakes",
            githubUrl: "https://github.com/ChrisRus"
        }
    },
    website: {
        name: "Encapsule Project",
        description: "MIT-licensed model-driven engineering tools for full-stack Node.js/HTML5 app developers.",
        url: "https://encapsule.io",
        theme: siteThemeData
    },
    pages: {

        '/sitemap': {
            pageTitle: "Encapsule Project Sitemap",
            pageDescription: "Hierarchical sitemap of public pages on the Encpsule.io website.",
            contentTitle: "Encapsule Project Site Pages",
            contentSubtitle: "A hierarchical listing of public pages published on the Encapsule Project website.",
            name: "Sitemap",
            tooltip: "Sitemap...",
            rank: 1000
        },

    }
};


