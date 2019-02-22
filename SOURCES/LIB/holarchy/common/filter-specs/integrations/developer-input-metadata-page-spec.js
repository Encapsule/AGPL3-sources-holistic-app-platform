// developer-input-metadata-page-spec.js


module.exports = {
    ____label: "Page Metadata",
    ____description: "Information provided to the integration filters factory describing a specific page in the website.",
    ____types: "jsObject",
    title: {
        ____label: "Page Title",
        ____description: "A short title for the page that is used to populate the browser title and history.",
        ____accept: "jsString"
    },
    description: {
        ____label: "Page Description",
        ____description: "A short description of this page that is used for page header metadata. And, in abbreviated lists as a short description.",
        ____accept: "jsString"
    },
    name: {
        ____label: "Page Name",
        ____description: "A short moniker to use as the display label for menus, buttons, and hyperlinks referring to this page.",
        ____accept: "jsString"
    },
    tooltip: {
        ____label: "Page Tooltip",
        ____description: "A short string to display on mouse over/hover over links/buttons/menus...",
        ____accept: "jsString"
    },
    rank: {
        ____label: "Page Peer Rank",
        ____description: "A integer value used to determine the order of this page relative to its siblings.",
        ____accept: "jsNumber",
        ____defaultValue: 0 // defaults to simple alpha sort
    },
    view_options: {
        ____label: "View Options Descriptor",
        ____description: "Information detailing view render options for this page.",
        ____types: "jsObject",
        ____defaultValue: {},
        show_in_sitemap: {
            ____label: "Show in Sitemap Flag",
            ____description: "Boolean flag indicating if the page should be listed in the sitemap.",
            ____accept: "jsBoolean",
            ____defaultValue: true
        },
        show_in_menubars: {
            ____label: "Show in Menubar Flag",
            ____description: "Page-specific menubar render options.",
            ____types: "jsBoolean",
            ____defaultValue: true
        },
        default_menubars_count: {
            ____label: "Default Menubars Count",
            ____description: "When this page is selected, show this many menubars in default page render.",
            ____types: "jsNumber",
            ____defaultValue: 2
        }
    },
    icons: {
        ____label: "Page Icons",
        ____description: "Icons for this page.",
        ____types: "jsObject",
        ____defaultValue: {},
        svg: {
            ____label: "Page SVG URL",
            ____description: "Site-relative URL of the page's SVG icon.",
            ____accept: "jsString",
            ____defaultValue:  "/images/quantcast-logo.svg"
        }
    }
};
