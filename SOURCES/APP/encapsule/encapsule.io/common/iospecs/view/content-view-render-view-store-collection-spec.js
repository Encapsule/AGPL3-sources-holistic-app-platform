// content-view-render-view-store-collection-spec.js

module.exports = {
    ____types: "jsObject",

    "holisticView_Collection": {
        ____label: "Collection View Content",
        ____description: "Renders a view collection based on the identity and order of subpages registered in the view model digraph.",
        ____types: "jsObject",
        markdownSource: {
            ____label: "Collection Markdown Content",
            ____description: "Markdown-format string that defines content above the list of subviews in the collection.",
            ____types: "jsArray",
            ____defaultValue: [
                "## Under Construction",
                "This section is under development and should be available shortly..."
            ],
            markdown: {
                ____label: "Markdown Content Line",
                ____description: "A single line of markdown content.",
                ____accept: "jsString",
            }
        }
    }
};
