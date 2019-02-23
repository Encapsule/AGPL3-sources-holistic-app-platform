// ux-base-metadata.js
//
// Defines Quantcast specific metadata for application derived from the rainier-ux-base package.
//
// Note that the schema of this JavaScript object is also set and enforced by
// the rainier-ux-base package in the metadata-store-constructor module.
// Metadata values here are combined with application-specific values as indicated
// by inline comments below. And, the combined metadata declaration is passed as
// input to the metadata-store-constructor module that validates the values and
// builds an in-memory digraph model that's used by both the UX app server and the
// UX client HTML5 app.

const packageMeta = require("../../../package.json");
const buildTag = require("../../../../../build/_build-tag");
const websiteThemeData = require("../view/theme");

var RUXBASE_METADATA = {

    // Schema and values set in rainier-ux-base package.
    organization: {
        name: "Quantcast, Corp.",
        location: "San Francisco CA",
        url: "https://quantcast.com",
        social: {
            twitterUrl: "https://twitter.com/Quantcast",
            githubUrl: "https://github.com/Quantcast"
        },
        copyrightHolder: {
            name: packageMeta.author.name
        }
    },

    // Schema and values set in rainier-ux-base package. Except for theme which is ultimately merged with values specified by the derived application.
    website: {
        // These values are overridden by a derived application.
        name: buildTag.displayName,
        description: buildTag.packageDescription,
        url: "http://localhost:4772",
        build: buildTag,
        env: {},
        // The base theme tree is merged w/the application theme tree.
        theme: websiteThemeData
    },

    // Schema for all page metadata is set in this (rainier-ux-base) package.
    // Specifc page metadata descriptors provided here cannot be overwritten
    // by the application. But otherwise the base and application-specific
    // page metadata declarations are merged.
    pages: {}

};

switch (buildTag.buildConfig.deployConfig.appDeployEnvironment) {
case "local":
case "development":
    RUXBASE_METADATA.pages = {

        "/user": {
            title: "User [Placeholder]",
            description: "Direct server access placeholder for user profile, and settings view.",
            name: "User [Placeholder]",
            tooltip: "User placeholder...",
            rank: 500,
            view_options: { show_in_sitemap: false }
        },

        "/user/login": {
            title: "Login [Placeholder]",
            name: "Login [Placeholder]",
            description: "Direct server access placeholder for the user login page view.",
            tooltip: "Login placeholder...",
            view_options: { show_in_sitemap: false }
        },

        "/user/logout": {
            title: "Logout [Placeholder]",
            name: "Logout [Placeholder]",
            description: "Direct server access placeholder for the user logout page view.",
            tooltip: "Logout placeholder...",
            view_options: { show_in_sitemap: false }
        },

        "/sitemap": {
            title: "Sitemap",
            name: "Sitemap",
            description: "Direct server access index of HTML5 page view resources produced by this application server.",
            tooltip: "Sitemap...",
            rank: 5000
        },

        "/developer": {
            title: "Developer",
            name: "Developer",
            description: "Direct server access developer views.",
            tooltip: "Developer...",
            rank: 1000
        },

        "/developer/integrations": {
            title: "Integration Tests",
            description: "Test pages for debugging integrations with backend services.",
            name: "Integration Tests",
            tooltip: "Integration test pages...",
            rank: 100,
            view_options: { show_in_sitemap: false }
        },

        "/developer/views": {
            title: "View Tests",
            description: "Test pages for debug/test of React components.",
            name: "View Tests",
            tooltip: "View Tests",
            rank: 200
        }

    };
}

module.exports = RUXBASE_METADATA;
