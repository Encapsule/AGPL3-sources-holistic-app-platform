// HolisticSoftwarePackageOverviw.jsx

const React = require('react');
const HolisticIconPageHeader = require('../common/HolisticIconPageHeader.jsx');
const HolisticStaticCollectionView = require('./HolisticStaticCollectionView.jsx');
const Markdown = require('react-remarkable');

module.exports = class HolisticSoftwarePackageDatasheet extends React.Component {

    render() {
        
        try {
            var index = 0;
            function makeKey() { return ("SoftwarePackageDatasheet" + index++); }
            var content = [];
            const appStateContext = this.props.appStateContext;
            const viewStore = appStateContext.viewStore;
            const metadata = this.props.document.metadata;
            const thisPageURI = metadata.page.uri;
            // See polytely/sources/common/iospecs/view/content-view-render-software-package-datasheet-spec.js
            const unboxedContent = this.props.document.data["holisticView_SoftwarePackage"];

            content.push(<HolisticIconPageHeader key={makeKey()} svg={metadata.page.icons.svg} title={metadata.page.contentTitle}
                         subtitle={metadata.page.contentSubtitle} />);

            var headerLinkBlock = [];

            headerLinkBlock.push(<div key={makeKey()}>
                                 <h5>
                                 <strong>Package Distribution: </strong><a href={unboxedContent.packageDetails.distributionURL}
                                 title="Package on npm...">{unboxedContent.packageDetails.distributionName}</a>{' '}
                                 (<a href={unboxedContent.packageDetails.distributionLicense.url} title="Distribution license...">
                                  {unboxedContent.packageDetails.distributionLicense.name}</a>){' / '}
                                 <strong>Package Source: </strong> <a href={unboxedContent.packageDetails.sourceRepository} title="Sources on GitHub...">
                                 {unboxedContent.packageDetails.sourceRepositoryName}</a>
                                 {' '}(<a href={unboxedContent.packageDetails.sourceLicense.url} title="Source license...">
                                       {unboxedContent.packageDetails.sourceLicense.name}</a>)
                                 </h5>
                                 </div>);

            if (unboxedContent.packageDetails.sourceNotes)
                headerLinkBlock.push(<div key={makeKey()}
                                     style={{ fontSize: '10pt', color: '#AFC6E9' }} >
                                     {unboxedContent.packageDetails.sourceNotes}
                                     </div>);

            headerLinkBlock.push(<div key={makeKey()} style={{ borderBottom: "2px solid #D7E3F4", paddingBottom: '1em' }} />);

            content.push(<div key={makeKey()} style={metadata.site.theme.softwarePackageLinkHeaderBlock}>{headerLinkBlock}</div>);

            content.push(<h2 key={makeKey()}>{metadata.page.name} Package Overview</h2>);
            content.push(<Markdown key={makeKey()} source={unboxedContent.introMarkdownSource.join("\n")} />);

            content.push(<h2 key={makeKey()}>{metadata.page.name} Package Documents</h2>);
            content.push(<HolisticStaticCollectionView key={makeKey()} {...this.props} noheader={true} />);

            return (<div>{content}</div>);

        } catch (exception_) {
            return (<div>HolisticSoftwarePackageDatasheet exception: {exception_.toString()}</div>);
        }

    } // end render method

} // end class HolisticSoftwarePackageOverview

