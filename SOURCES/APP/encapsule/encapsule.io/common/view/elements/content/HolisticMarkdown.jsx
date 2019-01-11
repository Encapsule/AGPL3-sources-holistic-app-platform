// HolisticMarkdown.jsx

// A thin wrapper around react-remarkable package to make it
// compatible with Encapsule/holistic view content routing protocol.
// https://github.com/acdlite/react-remarkable
// https://github.com/jonschlinkert/remarkable

const React = require('react');
const HolisticIconPageHeader = require('../common/HolisticIconPageHeader.jsx');
const HolisticStaticCollectionView = require('./HolisticStaticCollectionView.jsx');
const Markdown = require('react-remarkable');

module.exports = class HolisticMarkdownContent extends React.Component {

    render() {
        
        try {
            var pageMetadata = this.props.document.metadata.page;
            var markdownSource = this.props.document.data.holisticView_Markdown.markdownSource.join("\n");

            var key = 0;
            function makeKey() { return ("MarkdownContent" + key++); };

            var content = [];

            content.push(<HolisticIconPageHeader key={makeKey()} svg={pageMetadata.icons.svg} title={pageMetadata.contentTitle}
                         subtitle={pageMetadata.contentSubtitle}/>);
            content.push(<Markdown key={makeKey()} source={markdownSource}/>);

            if (pageMetadata.children.length) {
                content.push(<HolisticStaticCollectionView key={makeKey()} {...this.props} noheader={true}/>);
            }

            return (<div>{content}</div>);

        } catch (exception_) {
            return (<div>HolisticMarkdown exception: {exception_.toString()}</div>);
        }

    } // end render method

} // end class HolisticMarkdownContent
