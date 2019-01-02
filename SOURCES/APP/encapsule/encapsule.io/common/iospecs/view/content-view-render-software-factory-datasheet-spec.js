// content-view-render-software-library-datasheet.js

module.exports = {
    ____types: "jsObject",
    "holisticView_SoftwareFactory": {
        ____label: "Software Factory Descriptor Render Request",
        ____description: "Request to render to a software factory datasheet descriptor as HTML.",
        ____types: "jsObject",
        introMarkdownSource: {
            ____label: "Introduction Markdown Content",
            ____description: "Markdown-format introduction for this software factory.",
            ____types: "jsArray",
            ____defaultValue: [
                "### Under Construction",
                "Still working on this section..."
            ],
            markdown: {
                ____label: "Markdown Content Line",
                ____description: "A single line of markdown content.",
                ____accept: "jsString",

            }
        }
    }
};


