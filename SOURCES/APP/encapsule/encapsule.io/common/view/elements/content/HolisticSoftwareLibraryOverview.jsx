// HolisticSoftwareLibraryOverview.jsx

const React = require('react');
const HolisticIconPageHeader = require('../common/HolisticIconPageHeader.jsx');
const HolisticStaticCollectionView = require('./HolisticStaticCollectionView.jsx');
const Markdown = require('react-remarkable');

export class HolisticSoftwareLibraryOverview extends React.Component {

    render() {
        
        var index = 0;
        function makeKey() { return ("SoftwareLibraryOverview" + index++); }

        var content = [];

        const appStateContext = this.props.appStateContext;
        const viewStore = appStateContext.viewStore;

        const metadata = this.props.document.metadata;
        const thisPageURI = metadata.page.uri;

        // See polytely/sources/common/iospecs/view/content-view-render-software-package-datasheet-spec.js
        const unboxedContent = this.props.document.data["holisticView_SoftwareLibrary"];

        content.push(<HolisticIconPageHeader key={makeKey()} svg={metadata.page.icons.svg} title={metadata.page.contentTitle}
                     subtitle={metadata.page.contentSubtitle} />);

        content.push(<h2 key={makeKey()}>{metadata.page.name} Library Introduction</h2>);
        content.push(<Markdown key={makeKey()} source={unboxedContent.introMarkdownSource.join("\n")} />);

        content.push(<h2 key={makeKey()}>{metadata.page.name} Library Details</h2>);
        content.push(<HolisticStaticCollectionView key={makeKey()} {...this.props} noheader={true} />);

        return (<div>{content}</div>);

    } // end render method

} // end class HolisticSoftwareLibraryOverview
