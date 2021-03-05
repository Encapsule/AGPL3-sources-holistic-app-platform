// display-stream-artifact-generator-filter.js

// OMG ... this module ...

(function() {

    const arccore = require("@encapsule/arccore");
    const holarchy = require("@encapsule/holarchy");
    const d2r2 = require("@encapsule/d2r2");
    const cmtDisplayView = require("./"); // Currently, we're co-resident w/the DisplayView_T definition.

    const factoryResponse = arccore.filter.create({
        operationID: "A04R9PeERUatNtwHZ_cjkw",
        operationName: "DVVD Models Generator",
        operationDescription: "A filter that generates a DisplayView family CellModel (DV) and a ViewDisplay family d2r2Component (VD) as a matching pair using the specialization data you provide via request in-parameter.",

        inputFilterSpec: {
            ____label: "DVVD Models Generator Request",
            ____types: "jsObject",
            displayViewSynthesizeRequest: {
                ____label: "DisplayView_T::synthesizeCellModel Request",
                ____description: "The full request descriptor to be passed to DisplayView_T::synthesizeCellModel method.",
                ____accept: "jsObject" // We let DisplayView_T do the work of validating the contents of this namespace in the request.
            },
            reactComponentClass: {
                ____accept: "jsFunction" // This is a reference to class X's constructor function where X extends React.Component.
            }

        },

        outputFilterSpec: {
            ____types: "jsObject",
            CellModel: { ____accept: "jsObject" }, // This will be a CellModel class instance or constructor function request object for the same.
            d2r2Component: { ____accept: "jsObject" } // This will be a d2r2Component (whatever they are --- I forget how we pass them around; I think just a specialized filter at this point?)
        },

        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                let synthResponse = cmtDisplayView.synthesizeCellModel(request_.displayViewSynthesizeRequest); // Just the request in and see what happens.
                if (synthResponse.error) {
                    errors.push("The actual call to DisplayView_T::synthesizeCellModel failed with error:");
                    errors.push(synthResponse.error);
                    break;
                }

                const cellModelConstructorRequest = synthResponse.result;

                const cellModel = new holarchy.CellModel(cellModelConstructorRequest);
                if (!cellModel.isValid()) {
                    errors.push("The CellModel::constructor request we received back from DisplayView_T::synthesizeCellModel is DOA due to error:");
                    errors.push(cellModel.toJSON());
                    break;
                }

                const apmID = cellModelConstructorRequest.apm.ocdDataSpec.outputs.displayView.____appdsl.apm;

                // Must be kept in sync w/VDDV artifact generator.

                const viewDisplayClassName = `${request_.displayViewSynthesizeRequest.cellModelLabel}_ViewDisplay_${apmID}`;
                const displayLayoutNamespace = `layoutViewDisplay_${apmID}`;

                let renderDataSpec = { ____label: `${request_.displayViewSynthesizeRequest.cellModelLabel} Render Data Spec`, ____types: "jsObject" };
                renderDataSpec[displayLayoutNamespace] = { ...request_.displayViewSynthesizeRequest.specializationData.displayElement.displayLayoutSpec, ____defaultValue: undefined };

                console.log(`RENDER DATA SPEC FOR NEW d2r2 COMPONENT = "${JSON.stringify(renderDataSpec, undefined, 4)}"`);

                // ****************************************************************
                // ****************************************************************
                // SYNTHESIZE THE DISPLAY PROCESS REACT.COMPONENT
                // ****************************************************************
                // ****************************************************************

                class ViewDisplayProcess extends request_.reactComponentClass {

                    constructor(props_) {
                        super(props_);
                        this.displayName = viewDisplayClassName
                    }

                    componentDidMount() {
                        let actResponse = this.props.renderContext.act({
                            actorName: this.displayName,
                            actorTaskDescription: `This is new a new instance of React.Element ${this.displayName} process notifying its backing DisplayView cell that it has been mounted and is now activated.`,
                            actionRequest: { holistic: { common: { actions: { service: { html5: { display: { view: { linkDisplayProcess: { notifyEvent: "display-process-activated", reactElement: { displayName: this.displayName, thisRef: this } } } } } } } } } },
                            apmBindingPath: this.props.renderContext.apmBindingPath
                        });
                        super.componentDidMount();
                    }

                    componentWillUnmount() {

                        let actResponse = this.props.renderContext.act({
                            actorName: this.displayName,
                            actorTaskDescription: `This is a previously-linked React.Element ${this.displayName} process notifying its backing DisplayView cell that is is going to unmount and deactivate.`,
                            actionRequest: { holistic: { common: { actions: { service: { html5: { display: { view: { linkDisplayProcess: {  notifyEvent: "display-process-deactivating", reactElement: { displayName: this.displayName, thisRef: this } } } } } } } } } },
                            apmBindingPath: this.props.renderContext.apmBindingPath
                        });
                        super.componentWillUnmount();
                    }
                } // class DisplayProcess extends request_.reactComponentClass extends React.Component (presumably)

                // ****************************************************************
                // ****************************************************************
                // SYNTHESIZE THE DISPLAY PROCESS REACT.COMPONENT
                // ****************************************************************
                // ****************************************************************

                // WILL THIS WORK? :) MAGIC! (♥_♥)
                function fuckingMagic(magicClassName_) { return eval(`(function() { return (class ${magicClassName_} extends ViewDisplayProcess /*extends React.Component*/ {}); })();`); }

                // Now jam the synthesized class into a d2r2-generated filter that accepts data according to renderSpec and returns a bound React.Element via its response.result.
                // This is what we call a d2r2Component for lack a better short-hand for refering to it. In reality it's a data-to-display process transducer function (w/data filtering).

                synthResponse = d2r2.ComponentFactory.request({
                    id: cmtDisplayView.mapLabels({ OTHER: `${cellModelConstructorRequest.id}:d2r2Component` }).result.OTHERID,
                    name: `${request_.displayViewSynthesizeRequest.cellModelLabel} Display Process`,
                    description: "A filter that generates a React.Element instance created via React.createElement API from the reactComponentClass specified here bound to the request data.",
                    renderDataBindingSpec: { ...renderDataSpec },
                    reactComponent: fuckingMagic(viewDisplayClassName) // `${request_.displayViewSynthesizeRequest.cellModelLabel}_ViewDisplay_${apmID}`) // ᕕ( ᐛ )ᕗ
                });

                if (synthResponse.error) {
                    errors.push("Oh snap. Things were going so well... Unfortunately, we cannot synthesize a d2r2 React.Element synthesizer filter (d2r2Component) due to error:");
                    errors.push(synthResponse.error);
                    break;
                }

                const d2r2Component = synthResponse.result;

                console.log("RESULT d2r2 COMPONENT:");
                console.log(d2r2Component);

                // And, we're good?
                response.result = { CellModel: cellModel, d2r2Component };

                break;
            }
            if (errors.length) {
                errors.unshift("Unable to synthesize DisplayStream models due to fatal error:");
                response.error = errors.join(" ");
            }
            return response;
        }

    });

    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result // @encapsule/arccore.filter object

})();

