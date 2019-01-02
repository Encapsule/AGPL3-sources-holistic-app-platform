// content-view-render-software-library-datasheet.js

module.exports = {
    ____types: "jsObject",
    "holisticView_SoftwareLibrary": {
        ____label: "Software Library Descriptor Render Request",
        ____description: "Request to render to a software library descriptor as HTML.",
        ____types: "jsObject",
        introMarkdownSource: {
            ____label: "Introduction Markdown Content",
            ____description: "Markdown-format introduction for this software library.",
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


