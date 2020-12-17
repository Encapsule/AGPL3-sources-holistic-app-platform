
const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");

// v0.0.49-spectrolite

(function() {

    const factoryResponse = arccore.filter.create({
        operationID: "yYgnnofMQHCjacBRCYNhzQ",
        operationName: "Holistic Tab Service Kernel CellModel Factory",
        operationDescription: "Factory filter leveraged by the HolisticTabService class constructor filter to synthesize a specialized holistic tab service kernel CellModel.",
        inputFilterSpec: {
            ____types: "jsObject",
            appServiceCore: {
                ____label: "Holistic Service Core Specializations",
                ____description: "A reference to a HolisticServiceCore class instance set by the tab service kernel's boot action.",
                ____accept: "jsObject" // This is a valid HolisticServiceCore class instance
            },
            display: {
                ____label: "Holistic Service Display Specializations",
                ____description: "Information set by the tab service kernel's boot action used to specialize the behavior of the sevice's display.",
                ____types: "jsObject",
                d2r2ComponentRouter: {
                    ____label: "@encapsule/d2r2 <ComponentRouter/>",
                    ____description: "A reference to an @encapsule/d2r2 <ComponentRouter/> React.Component that may be used like any other React.Component (w/calling conventions over this.props). But, that resolves to 1:N registered components available in this service instance based on the format of the data you send via this.props.",
                    ____accept: "jsFunction" // This is a valid <ComponentRouter/> instance configured for use in the tab service (which is of course a React.Component-derived class which we're passing through via its constructor function reference here).
                }
            }
        },
        outputFilterSpec: {
            ____accept: "jsObject" // This an @encapsule/holarcy CellModel that encapsulates a specialized holistic tab service kernel cell
        },
        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const appBuild = request_.appServiceCore.getAppBuild();

                const cellModel = new holarchy.CellModel({
                    id: "JatYSE8JQj6GxT8AOsbssQ",
                    name: "Holistic Tab Service Kernel",
                    description: "Holistic tab service kernel cell manages the overall lifecycle of a tab service and provide base-level services to other cells that implement app-specific features, logic, etc.",
                    apm: require("./AbstractProcessModel-app-client-kernel"),
                    actions: [
                        require("./ControllerAction-app-client-kernel-cell-plane-error"),
                        require("./ControllerAction-app-client-kernel-hook-events"),
                        require("./ControllerAction-app-client-kernel-notify-event"),
                        require("./ControllerAction-app-client-kernel-step-worker"),
                        require("./ControllerAction-app-client-kernel-signal-lifecycle-event")
                    ],
                    subcells: [
                        require("./AppClientDOMLocation"), // Manages the application's interface between the DOM href and hashrouter locations and the state of the cellular runtime process.

                        // v0.0.49-spectrolite
                        // This cell here needs to be passed a pre-constructed <ComponentRouter/> that it can just use to satisfy incoming d2r2 requests (or not based on the request data). This will not occur during service construction instead of a runtime as part of the kernel's process evaluation.
                        require("./AppClientDisplayAdapter"), // Encapsules low level details of rendering HTML5 view via @encapsule/d2r2 and Facebook React on behalf of AppClientView.

                        // v0.0.49-spectrolite this is very old. Remove it and replace w/similarly named modern concept (PageView and PageViewController to be synthesized in here I think).
                        // TRY DISABLING THIS
                        require("./AppClientView"), // Provides high-level orchestration for lifespan of application-specific subview processes (a concept we haven't discussed yet).

                        // v0.0.49-spectrolite pretty suspicious there's anything all that good in here either
                        // TRY DISABLING THIS
                        require("@encapsule/holarchy-cm").cml, // Low-level shared CellModel library used by @encapsule/holistic RTL's.

                        // v0.0.49-spectrolite disabled (needed? - YEA I THINK NO IT'S NOT)
                        require("@encapsule/holistic-app-common-cm").cml // Shared holistic app server/client kernel CellModel library? What is even in here at this point?
                    ]
                });

                if (!cellModel.isValid) {
                    errors.push(`We were unable to synthesize a specialized tab service kernel CellModel for ${appBuild.app.name} due to error:`);
                    errors.push(cellModel.toJSON());
                    break;
                }

                response.result = cellModel;


                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    }); // arccore.filter.create

    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result; // This is an @encapsule/arccore.filter that synthesizes a specialized holistic tab service kernel CellModel returned via response.result

})()

