// page-title.jsx

const React = require('react');

module.exports = React.createClass({

    displayName: "PageTitle",

    render: function() {
        var titleHtml;
        try {
            var metadata = this.props.document.metadata;
            var currentViewURI = metadata.page.uri;

            var theme = metadata.site.theme;

            var isRootPage = (currentViewURI === '/');
            if (isRootPage) {
                titleHtml =
                    (<div style={theme.titleBlock}>
                     <span style={theme.title}>{this.props.document.metadata.site.name}</span><br />
                     <span style={theme.subtitle}>{this.props.document.metadata.page.description}</span>
                     </div>
                    );
            } else {
                titleHtml =
                    (<div style={theme.titleBlock}>
                     <span style={theme.title}>{this.props.document.metadata.page.title}</span><br />
                     <span style={theme.subtitle}>{this.props.document.metadata.page.description}</span>
                     </div>
                    );
            }

        } catch (exception_) {
            return (<div>Fatal exception in {this.className}: {exception_.toString()}</div>);
        }
        return titleHtml;
    }

});
