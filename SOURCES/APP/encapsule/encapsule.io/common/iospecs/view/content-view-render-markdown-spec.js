// content-view-render-markdown-spec.js

module.exports =  {
    ____types: "jsObject",
    holisticView_Markdown: {
        ____label: "Markdown Content View",
        ____description: "Markdown content HTML render request.",
        ____types: "jsObject",
        markdownSource: {
            ____label: "Markdown Content",
            ____description: "Markdown-format string that defines content above the list of subviews in the collection.",
            ____types: "jsArray",
            ____defaultValue: [
                "## Under Construction",
                "This section is still under development..."
            ],
            markdown: {
                ____label: "Markdown Content Line",
                ____description: "A single line of markdown content.",
                ____accept: "jsString",

            }
        }
    }
};
