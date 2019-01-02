// copyright.jsx

const React = require('react');

var Copyright = React.createClass({
    displayName: "Copyright",

    componentDidMount: function() {
        var self = this;
        this.clockInterval = setInterval(function() {
            var clock = new Date().toString();
            self.setState({ clock: clock });
        }, 500);
    },

    componentWillUnmount: function() {
        clearInterval(this.clockInterval);
    },

    getInitialState: function() {
        var clock = new Date().toString();
        return ({ clock: clock });
    },

    render: function() {
        try {
            const metadata = this.props.document.metadata;
            const theme = metadata.site.theme;

            var clock = this.state.clock;

            var iconStyles = { opacity: 0.5 };

            return (<div style={theme.copyrightBlock}>
                    <div style={{ float: 'left', width: '33%', textAlign: 'left' }}>
                    <span>
                    <a href={metadata.org.social.twitterUrl}>
                    <img src="/images/twitter.svg" title={"Follow " + metadata.org.name + " on Twitter. Thank you for your support!"}
                    style={{ width: '14px', height: '14px', textAlign: 'middle', opacity: 0.3}} />
                    </a><a href={metadata.org.social.githubUrl}>
                    <img src="/images/github-octocat.svg" title={"Visit " + metadata.org.name + "'s GitHub."}
                    style={{ width: '12px', height: '12px', textAlign: 'middle', opacity: 0.3}} />
                    </a>{' '}
                    {metadata.org.name}, {metadata.org.location}
                    </span>
                    </div>
                    <div style={{ float: 'right', width: '33%', textAlign: 'right' }}>
                    <span>
                    Copyright &copy; {metadata.agent.instance.fy} {metadata.org.copyrightHolder.name}{' '}
                    <a href={metadata.org.copyrightHolder.twitterUrl}>
                    <img src="/images/twitter.svg" title={"Follow " + metadata.org.copyrightHolder.name + " on Twitter."}
                    style={{ width: '14px', height: '14px', textAlign: 'middle', opacity: 0.3}} />
                    </a><a href={metadata.org.copyrightHolder.githubUrl}>
                    <img src="/images/github-octocat.svg" title={"Visit " + metadata.org.copyrightHolder.name + "'s GitHub."}
                    style={{ width: '12px', height: '12px', textAlign: 'middle', opacity: 0.3}} />
                    </a>
                    </span>
                    </div>
                    <div style={{ margin: 'auto', width: '33%', textAlign: 'center' }}><span style={theme.copyrightBlockClock}>{clock}</span></div>
                    <div style={{ clear: 'all' }} />
                    </div>
                   );
        } catch (exception_) {
            return (<div>Fatal exception in {this.className}: {exception_.toString()}</div>);
        }
    }
});

module.exports = Copyright;

