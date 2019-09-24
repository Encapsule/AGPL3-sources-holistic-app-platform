// HolisticMarkdownContent.jsx
//
// A think wrapper around the `react-markdown` package.
//

const React = require('react');
const reactComponentBindingFilterFactory = require('../binding-factory');
const ReactMarkdown = require('react-markdown');

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "O4p4w9-cTAuhDP-oJG14bA",
    name: "HolisticMarkdownContent",
    description: "Renders markdown data as HTLM content via the react-markdown library.",
    renderDataBindingSpec: {
        ____types: "jsObject",
        HolisticMarkdownContent_AonatdsFRQmv6SgeqvJIQw: {

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
            }
        },
        styles: {
            ____label: "Container Styles",
            ____description: "Styles applied to the DIV container around the rendered markdown content.",
            ____accept: "jsObject",
            ____defaultValue: { background: "yellow" } // this is to alert developers that they should style their markdown
        }
    },
    reactComponent: class HolisticMarkdownContent extends React.Component {
        render() {
            try {
                const renderRequest = this.props.renderData['HolisticMarkdownContent_AonatdsFRQmv6SgeqvJIQw'];
                const markdownSource = renderRequest.markdownContent.join(' ');
                return (<div style={this.props.renderData.styles}><ReactMarkdown options={renderRequest.markdownOptions} source={markdownSource} /></div>);
            } catch (exception_) {
                return (<div>HolisticMarkdownContent exception: {exception_.toString()}</div>);
            }
        }
    }
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
