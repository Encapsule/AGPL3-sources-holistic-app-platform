// HolisticEmptyPlaceholder.jsx
//
// An empty <span/> rendered via <ComponentRouter/> in cases where we need a temporary placeholder.
//

const React = require('react');
const reactComponentBindingFilterFactory = require('../binding-factory');
const ReactMarkdown = require('react-markdown');

var factoryResponse = reactComponentBindingFilterFactory.create({
    id: "8AdCdPImQB-wE7z7nzXS5Q",
    name: "HolisticEmptyPlaceholder",
    description: "Renders an empty <span/>.",
    renderDataBindingSpec: {
        ____types: "jsObject",
        "HolisticEmptyPlaceholder_8AdCdPImQB-wE7z7nzXS5Q": {
            ____label: "Empty Placeholder Render Request",
            ____description: "Renders an empty <span/>.",
            ____accept: "jsObject"
        }
    },
    reactComponent: class HolisticMarkdownContent extends React.Component {
        render() { return (<span/>); }
    }
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
