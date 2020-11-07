// SOURCES/common/view/elements/component/RUXBase_PageContent_AppDataStoreStatus.jsx
//

const React = require('react');
const reactComponentBindingFilterFactory = require('./binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "EqXm-855SGCqc-lQ5NccLQ",
    name: "RUXBase_PageContent_AppDataStoreStatus",
    description: "<RUXBase_PageContent_AppDataStoreStatus/> React component data binding filter.",

    renderDataBindingSpec: {
        ____types: "jsObject",
        RUXBase_PageContent_AppDataStoreStatus: {
            ____accept: "jsObject"
        } // RUXBase_PageContent_AppDataStoreStatus
    },

    reactComponent: React.createClass({
        displayName: "RUXBase_PageContent_AppDataStoreStatus",

        getInitialState: function() {
            return {
                showRawResponse: false
            };
        },

        onClickToggleDetail: function() {
            this.setState({
                showRawResponse: !this.state.showRawResponse
            });
        },

        render: function() {
            try {
                var keyIndex = 0;
                function makeKey() { return ("RUXBase_PageContent_AppDataStoreStatus" + keyIndex++); }

                var ComponentRouter = this.props.appStateContext.reactComponentRouter;
                const metadata = this.props.document.metadata;
                const theme = metadata.site.theme;
                const renderData = this.props.renderData['RUXBase_PageContent_AppDataStoreStatus'];
                const appDataStore = this.props.appStateContext.appDataStore;

                var content = [];

                content.push(<h1 key={makeKey()}>Application Data Store Status</h1>);

                content.push(<pre key={makeKey()} style={theme.classPRE}>
                             appData.base.runtime.context ........................................................................
                             {' '}{appDataStore.base.runtime.context}<br/>

                             appData.base.runtime.client.state ...................................................................
                             {' '}{appDataStore.base.runtime.client.state}<br/>
                             appData.base.runtime.client.errors ..................................................................
                             {' '}{appDataStore.base.runtime.client.errors.length} (in queue)<br/>

                             appData.base.runtime.client.subsystems.network.scoreboard ...........................................
                             {' '}{Object.keys(appDataStore.base.runtime.client.subsystems.network.scoreboard).length} (requests)<br/>

                             appData.base.runtime.client.subsystems.authentication ...............................................
                             {' '}{appDataStore.base.runtime.client.subsystems.authentication.state}<br/>

                             appData.base.runtime.client.subsystems.authorization ................................................
                             {' '}{appDataStore.base.runtime.client.subsystems.authorization.state}<br/>

                             appData.base.runtime.client.subsystems.rainier.state ................................................
                             {' '}{appDataStore.base.runtime.client.subsystems.rainier.state}<br/>

                             appData.base.runtime.client.subsystems.rainier.clientSession.state ..................................
                             {' '}{appDataStore.base.runtime.client.subsystems.rainier.clientSession.state}<br/>

                             appData.base.runtime.client.subsystems.rainier.clientSession.data.advertisers.state .................
                             {' '}{appDataStore.base.runtime.client.subsystems.rainier.clientSession.data.advertisers.state}<br/>

                             appData.base.runtime.client.subsystems.rainier.clientSession.data.availability.state ................
                             {' '}{appDataStore.base.runtime.client.subsystems.rainier.clientSession.data.availability.state}<br/>

                             appData.base.runtime.client.subsystems.rainier.clientSession.data.queryDateRange.state ..............
                             {' '}{appDataStore.base.runtime.client.subsystems.rainier.clientSession.data.queryDateRange.state}<br/>

                             appData.base.runtime.client.subsystems.rainier.clientSession.metadata ...............................
                             {' '}{JSON.stringify(appDataStore.base.runtime.client.subsystems.rainier.clientSession.metadata)}<br/>

                             </pre>);

                return (<div style={theme.base.RUXBase_PageContent_AppDataStoreStatus.container}>{content}</div>);

            } catch (exception_) {
                return (<div>Fatal exception in &lt;RUXBase_PageContent_AppDataStoreStatus/&gt;: {exception_.toString()}</div>);
            }
        }
    })

});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
