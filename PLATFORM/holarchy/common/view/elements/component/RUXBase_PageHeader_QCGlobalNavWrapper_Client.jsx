// sources/common/view/elements/component/RUXBase_PageHeader_QCGlobalNavWrapper_Client.jsx

require('callahan-styles/css/callahan.css');

const React = require('react');
const reactComponentBindingFilterFactory = require('rainier-ux-base/common').factories.view.reactComponentBindingFilter;
const GlobalNav = require('qc-global-navigation');
const build = require('../../../../../../../build/_build-tag.js');

class GlobalNavPageHeaderClient extends React.Component{

    constructor(props){
        super(props);
        var globalNavConfig = {
            product: 'advertise',
            section: 'rainier',
            env: build.buildConfig.deployConfig.appDeployEnvironment == 'production' ? 'production' : 'test',
            footer: false
        }

        GlobalNav.init(globalNavConfig);
        this.handleAdvertiserChange = this.handleAdvertiserChange.bind(this);
        GlobalNav.addObserver(this.handleAdvertiserChange);
    }

    componentDidMount(){
        const item = GlobalNav.getContext('account'); //returns an object like: //{rtbid: null, name: "Microsoft", pCode: "tTB93UFC5vepM", permission: null, isMarketer: true}
        if (item) {
            const advertiser = {pcode: `p-${item.pCode}`};
            const request = { actorAdvertiserInit: advertiser };
            const factoryResponse = this.props.integrations.write.request(request);
            if (factoryResponse.error) {
                console.log(`Error getting state actor: ${factoryResponse.error}`);
                //TODO write error to ~.base.client.runtime.errors
            }
        let stateActor = factoryResponse.result;
        }
    }

    handleAdvertiserChange (event, item) {
        if (item.type === 'account') {
            let advertiser = {pcode: `p-${item.data.pCode}`};
            let request = { actorAdvertiserChange: advertiser };
            let factoryResponse = this.props.integrations.write.request(request);
            if (factoryResponse.error) {
                console.log(`Error getting state actor: ${factoryResponse.error}`);
                throw `Error getting state actor: ${factoryResponse.error}` ;
            }
            let stateActor = factoryResponse.result;
            return stateActor;
        }
    }

    render(){
        return (<div></div>);
    }
}

var factoryResponse = reactComponentBindingFilterFactory.request({
  id: "Acz_zi_YSI6nCgnyP4x7rw",
  name: 'RUXBase_PageHeader_QCGlobalNavWrapper_Client',
  description: "Filter spec for for GlobalNav for client",
  renderDataBindingSpec: {
    ____types: 'jsObject',
    RUXBase_PageHeader_QCGlobalNavWrapper: {
      ____types: 'jsObject'
    }
  },
  reactComponent: GlobalNavPageHeaderClient
});

if (factoryResponse.error)
  throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
