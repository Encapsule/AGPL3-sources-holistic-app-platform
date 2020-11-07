// sources/common/view/elements/page/RUXBase_PagePanel_Errors.jsx
//

const React = require('react');
const reactComponentBindingFilterFactory = require('./binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "oHH8k_WYQrKE4eoeaT_C5g",
    name: "RUXBase_PagePanel_Errors",
    description: "<RUXBase_PagePanel_Errors/> React Component Binding",
    renderDataBindingSpec: {
    ____types: "jsObject",
        RUXBase_PagePanel_Errors: {
            ____types: "jsObject",
            renderOptions: {
                ____accept: "jsObject",
                ____defaultValue: {}
            }
        }
    },
    reactComponent: React.createClass({
        displayName: "RUXBase_PagePanel_Errors",

        componentWillReceiveProps: function(nextProps_) {
            var currentErrorCount = this.props.appStateContext.appDataStore.base.runtime.client.errors.length;
            var componentErrorCount = this.state.errorCount;
            if (componentErrorCount !== currentErrorCount) {
                this.setState({ showDetails: true, errorCount: currentErrorCount });
            }
        },


        getInitialState: function() {
            var initialErrorCount = this.props.appStateContext.appDataStore.base.runtime.client.errors.length;
            var initialShowDetails = (initialErrorCount?true:false); // If there are error(s) in the queued
            return ({
                showDetails: initialShowDetails,
                errorCount: initialErrorCount
            });
        },

        onClickToggleDetails: function() {
            this.setState({ showDetails: !this.state.showDetails,
                            errorCount: this.props.appStateContext.appDataStore.base.runtime.client.errors.length
                          });
        },

        render: function() {

            try {
                var self = this;
                var ComponentRouter = this.props.appStateContext.reactComponentRouter;
                const metadata = this.props.document.metadata;
                const theme = metadata.site.theme;
                const renderData = this.props.renderData['RUXBase_PagePanel_Errors'];
                const appData = this.props.appStateContext.appDataStore;
                var keyIndex = 0;
                function makeKey() { return ("RUXBase_PagePanel_Errors" + keyIndex++); }
                var content = [];

                if (!this.state.showDetails) {
                    content.push(<div key={makeKey()} style={theme.base.RUXBase_PagePanel_Errors.closed.container}>
                                 <img src='/advertise/rainier/images/json-doc.svg' style={theme.base.RUXBase_PagePanel_Errors.closed.icon} onClick={this.onClickToggleDetails} title="Show error console..."/>
                                 </div>);
                } else {
                    content.push(<div key={makeKey()} style={theme.base.RUXBase_PagePanel_Errors.closed.container}>
                                 <img src='/advertise/rainier/images/json-doc.svg' style={theme.base.RUXBase_PagePanel_Errors.closed.iconDisabled} onClick={this.onClickToggleDetails} title="Hide error console..."/>
                                 </div>);


                    var openPanelContent = [];

                    openPanelContent.push(<div key={makeKey()} style={theme.base.RUXBase_PagePanel_Errors.open.hideDetails} onClick={this.onClickToggleDetails} title="Hide error console...">
                                          <img src='/advertise/rainier/images/json-doc.svg' style={theme.base.RUXBase_PagePanel_Errors.open.icon}/>
                                          {metadata.site.name} Runtime Error Console</div>);

                    var openPanelContentInner = [];

                    openPanelContentInner.push(<div key={makeKey()} style={theme.base.RUXBase_PagePanel_Errors.open.guidance}>
                                               <p>Errors reported here are <strong>fatal</strong>, non-recoverable, errors typically caused by error(s) in new feature code...</p>
                                               </div>);

                    var errors = [];
                    if (!appData.base.runtime.client.errors.length) {
                        errors.push(<p key={makeKey()}>Error queue is empty.</p>);
                    } else {
                        appData.base.runtime.client.errors.forEach(function(error_) {
                            errors.push(<ComponentRouter key={makeKey()} {...self.props} renderData={error_}/>);
                        });
                    }

                    openPanelContentInner.push(<div key={makeKey()} style={theme.base.RUXBase_PagePanel_Errors.open.errorListContainer}>{errors}</div>);

                    openPanelContent.push(<div key={makeKey()} style={theme.base.RUXBase_PagePanel_Errors.open.containerInner}>{openPanelContentInner}</div>);

                    content.push(<div key={makeKey()} style={theme.base.RUXBase_PagePanel_Errors.open.container}>
                                 {openPanelContent}
                                 </div>)

                }

                return (<div>{content}</div>);

            } catch (exception_) {
                return (<div>Fatal exception in &lt;RUXBase_PagePanel_Errors/&gt;: {exception_.toString()}</div>);
            }

        }
    })
});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
