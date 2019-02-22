// sources/common/view/elements/component/RUXBase_PageHeader_QCGlobalNavWrapper_Server.jsx

const React = require('react');
const reactComponentBindingFilterFactory = require('rainier-ux-base/common').factories.view.reactComponentBindingFilter;

class GlobalNavPageHeaderServer extends React.Component {
    render() {
        const theme = this.props.document.metadata.site.theme;
	return (<div style={theme.base.RUXBase_PageHeader_QCGlobalNavWrapper.server.container}>
                <div>One moment please...</div>
                </div>);
    }
}

var factoryResponse = reactComponentBindingFilterFactory.request({
  id: "B0Ll5xnzQ5aEty1iDSB3tQ",
  name: 'RUXBase_PageHeader_QCGlobalNavWrapper_Server',
  description: "Filter spec for GlobalNav for server (dummy)",
  renderDataBindingSpec: {
    ____types: 'jsObject',
    RUXBase_PageHeader_QCGlobalNavWrapper: {
      ____types: 'jsObject'
    }
  },
  reactComponent: GlobalNavPageHeaderServer
});

if (factoryResponse.error)
  throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
