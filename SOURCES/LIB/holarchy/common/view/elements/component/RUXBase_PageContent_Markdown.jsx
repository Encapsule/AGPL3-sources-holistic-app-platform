// RUXBase_PageContent_Markdown.jsx
//
// A think wrapper around the `react-markdown` package.
//

const React = require('react');
const reactComponentBindingFilterFactory = require('../binding-factory');
const ReactMarkdown = require('react-markdown');

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "84jqUkLzTLecFmu2PMI6qQ",
    name: "RUXBase_PageContent_Markdown",
    description: "React component binding filter for <RUXBase_PageContent_Markdown/>.",
    renderDataBindingSpec: {
        ____types: "jsObject",
        RUXBase_PageContent_Markdown: {
            ____label: "Markdown Content HTML Render Request",
            ____description: "Renders an array of markdown-encoded strings as HTML content.",
            ____types: "jsObject",
            markdownContent: {
                ____label: "Markdown Content Array",
                ____description: "An array of markdown-encoded strings joined with space delimiters.",
                ____types: "jsArray",
                ____defaultValue: [
                    "## Missing Content\n\n",
                    "Sorry, no markdown-encoded content was specified.\n\n"
                ],
                markdownLine: {
                    ____label: "Markdown Line",
                    ____description: "A markdown-encoded string taken as a markdown section.",
                    ____accept: "jsString"
                }
            },
            markdownOptions: {
                ____label: "Markdown Options",
                ____description: "An options object to pass through to the underlying <ReactMarkdown/> component.",
                ____accept: "jsObject",
                ____defaultValue: {}
            },
            viewOptions: {
                ____label: "View Options",
                ____description: "An options object used to customize the React rendering of the wrapper around the hosted <Markdown/> component.",
                ____types: "jsObject",
                ____defaultValue: {},
                useContainerStyles: {
                    ____label: "Use Container Styles Flag",
                    ____description: "Indicates if RUXBase_PageContent_Markdown should use its programmatic container styles or just a plain <DIV/>.",
                    ____accept: "jsBoolean",
                    ____defaultValue: false
                }
            }
        }
    },
    reactComponent: React.createClass({
        displayName: "MarkdownContent",
        render: function() {
            try {
                // var ComponentRouter = this.props.appStateContext.reactComponentRouter;
                const metadata = this.props.document.metadata;
                const theme = metadata.site.theme;
                const renderData = this.props.renderData['RUXBase_PageContent_Markdown'];
                var keyIndex = 0;
                function makeKey() { return ("RUXBase_PageContent_Markdown" + keyIndex++); }
                var content = [];
                var markdownSource = renderData.markdownContent.join(' ');
                content.push(<ReactMarkdown key={makeKey()} options={renderData.markdownOptions} source={markdownSource}/>);
                if (renderData.viewOptions.useContainerStyles)
                    return (<div style={theme.base.RUXBase_PageContent_Markdown.container}>{content}</div>);
                else
                    return (<div>{content}</div>);
            } catch (exception_) {
                return (<div>RUXBase_PageContent_Markdown exception: {exception_.toString()}</div>);
            }
        }
    })
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
