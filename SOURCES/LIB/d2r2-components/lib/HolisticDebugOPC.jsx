
const React = require("react");
const reactComponentBindingFactory = require("./binding-factory");

const factoryResponse = reactComponentBindingFactory.create({
    id: "usYC_KHQRliNsKOqpokkTA",
    name: "<HolisticDebugOPC/>",
    description: "Generic information about an OPC instance.",

    renderDataBindingSpec: {
        ____types: "jsObject",
        HolisticDebugOPC: {
            ____types: "jsObject",
            opcRef: {
                ____types: "jsObject"
            }
        }
    },

    reactComponent: class HolisticDebugOPC extends React.Component {

        render() {

            return (<div>
                    <pre>
                    {JSON.stringify(this.props.renderData.opcRef, undefined, 2)}
                    </pre>
                    </div>
                   );
        }

    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

