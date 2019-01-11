// HolisticViewStoreCollection.jsx

const React = require('react');
const HolisticIconPageHeader = require('../common/HolisticIconPageHeader.jsx');
const Markdown = require('react-remarkable');

// default: standard props via spread
//
// To embed in another top-level page render component:
// set this.props.noheader = true


module.exports = class HolisticStaticCollectionView extends React.Component {

    render() {

        var index = 0;
        function makeKey() { return ("ViewStoreCollection" + index++); }

        var content = [];

        const appStateContext = this.props.appStateContext;
        const viewStore = appStateContext.viewStore;

        const metadata = this.props.document.metadata;
        const thisPageURI = metadata.page.uri;

        if (!this.props.noheader) {
            const unboxedContent = this.props.document.data["holisticView_Collection"];
            content.push(<HolisticIconPageHeader key={makeKey()} svg={metadata.page.icons.svg}
                         title={metadata.page.contentTitle} subtitle={metadata.page.contentSubtitle} />);

            if (unboxedContent.markdownSource.length)
                content.push(<Markdown key={makeKey()} source={unboxedContent.markdownSource.join("\n")} />);
        }

        var subviews = [];

        if (!metadata.page.children.length) {
            subviews.push(<div key={makeKey()}><p><i>Under construction...</i></p></div>);
        } else {
            for (var subView of metadata.page.children) {
                var subviewProperties = viewStore.getVertexProperty(subView);

                subviews.push(<div key={makeKey()} style={{ marginBottom: '0em'}}>
                              <div style={{ marginBottom: '0.33em' }}>

                              <img src={subviewProperties.icons.svg}
                              style={{ width: '24px', height: '24px', marginRight: '0.5em', verticalAlign: 'middle'}} />

                              <span style={metadata.site.theme.header4}>
                              <a href={subView} title={subviewProperties.contentSubtitle}><strong>{subviewProperties.name}</strong></a> - {subviewProperties.pageTitle}
                              </span>
                              </div>
                              <div key={makeKey()} style={{position: 'relative', top: '-0.5em', marginLeft: '32px', color: '#5F8DD3'}}><strong>{subviewProperties.pageDescription}</strong></div>
                              </div>);


                if (subviewProperties.children.length) {
                    var subviewSections = [];
                    for (var subviewSection of subviewProperties.children) {
                        var subviewSectionProperties = viewStore.getVertexProperty(subviewSection);
                        subviewSections.push(<div key={makeKey()}>
                                             <img src={subviewSectionProperties.icons.svg}
                                             style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '0.5em' }} />
                                             <span style={{ verticalAlign: 'middle' }}>
                                             <a href={subviewSection} title={subviewSectionProperties.pageDescription}>
                                             <strong>{subviewSectionProperties.name}</strong></a> - {subviewSectionProperties.pageDescription}
                                             </span>
                                             </div>);
                    }
                    subviews.push(<div key={makeKey()} style={{marginLeft: '32px', marginBottom: '1em'}}>{subviewSections}</div>);
                }
            }
        }

        const containerStyles = {
            border: '1px solid #BCD',
            borderRadius: '0.5em',
            padding: '0.5em',
            paddingBottom: '0px',
            backgroundColor: 'rgba(215,235,255,0.15)'
        };

        content.push(<div key={makeKey()} style={containerStyles}>{subviews}</div>);

        return (<div>{content}</div>);

    } // end render method
    
} // end class HolisticStaticCollectionView
