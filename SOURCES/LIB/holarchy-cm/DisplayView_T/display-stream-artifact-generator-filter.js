// display-stream-artifact-generator-filter.js

// OMG ... this module ... IS NAMED POORLY

(function() {

    const arccore = require("@encapsule/arccore");
    const holarchy = require("@encapsule/holarchy");
    const React = require("react");
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

                console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\");
                console.log(`[${this.operationID}::${this.operationName}] Building a new DisplayView <-> ViewDisplay process bus (DVVD Bus) cellModelLabel="${request_.displayViewSynthesizeRequest.cellModelLabel}"...`);

                // ****************************************************************
                // ****************************************************************
                // SYNTHESIZE A SPECIALIZED "DISPLAY VIEW" CellModel ARTIFACT
                // ****************************************************************
                // ****************************************************************

                console.log(`> Attempting to synthesize a specialized DisplayView CellModel for cellModelLabel="${request_.displayViewSynthesizeRequest.cellModelLabel}"...`);
                let synthResponse = cmtDisplayView.synthesizeCellModel(request_.displayViewSynthesizeRequest); // Just the request in and see what happens.
                if (synthResponse.error) {
                    errors.push("The actual call to DisplayView_T::synthesizeCellModel failed with error:");
                    errors.push(synthResponse.error);
                    break;
                }

                const cellModelConstructorRequest = synthResponse.result;

                const cellModel = new holarchy.CellModel(cellModelConstructorRequest);
                if (!cellModel.isValid()) {
                    errors.push("The CellModel::constructor request we received back from DisplayView_T::synthesizeCellModel is not a valid CellModel:");
                    errors.push(cellModel.toJSON());
                    break;
                }

                console.log(`> DisplayView CellModel for cellModelLabel="${request_.displayViewSynthesizeRequest.cellModelLabel}" synthesized!`);

                // This is the ID of of the newly-synthesized DisplayView family CellModel's APM.
                const apmID = cellModelConstructorRequest.apm.ocdDataSpec.outputs.displayView.____appdsl.apm;

                // Must be kept in sync w/DVVD artifact generator.

                const viewDisplayClassName = `${request_.displayViewSynthesizeRequest.cellModelLabel}_ViewDisplay_${Buffer.from(apmID, "base64").toString("hex")}`;
                const displayLayoutNamespace = viewDisplayClassName;

                let renderDataSpec = { ____label: `${request_.displayViewSynthesizeRequest.cellModelLabel} Render Data Spec`, ____types: "jsObject" };
                renderDataSpec[displayLayoutNamespace] = { ...request_.displayViewSynthesizeRequest.specializationData.displayElement.displayLayoutSpec, ____defaultValue: undefined };

                // console.log(`RENDER DATA SPEC FOR NEW d2r2 COMPONENT = "${JSON.stringify(renderDataSpec, undefined, 4)}"`);

                let fascadeClass; // "creative" synthesis done below.

                (function() {

                    // This is the short cellModelLabel used to synthesize the newly-synthesized DisplayView family CellModel.
                    let friendlyClassMoniker = request_.displayViewSynthesizeRequest.cellModelLabel; // viewDisplayClassName;

                    // ****************************************************************
                    // ****************************************************************
                    // SYNTHESIZE A SPECIALIZED "VIEW DISPLAY" d2r2Component ARTIFACT
                    // ****************************************************************
                    // ****************************************************************

                    class ViewDisplayProcess extends request_.reactComponentClass {

                        constructor(props_) {
                            console.log(`ViewDisplayProcess::constructor on behalf of ${viewDisplayClassName}`);
                            super(props_);
                            if (!this.displayName) {
                                throw new Error(`Um, yea. We're going to have to have you go ahead and get your class "${friendlyClassMoniker}" that extends React.Component to define a constructor function, and then assign this.displayName in the body of that constructor function so that "${viewDisplayClassName}" that extends your "${friendlyClassMoniker}" class can correctly deduce where it is in the display tree when it's time to link to its backing DisplayView cell process. Thanks.`);
                            }
                            this.displayPath = `${props_.renderContext.displayPath}.${this.displayName}`;

                            // TRY
                            console.log(`ViewDisplayProcess::constructor attempting to register ViewDisplay instance w/backing DisplayView cell on behalf of ${viewDisplayClassName}`);
                            let actResponse = this.props.renderContext.act({
                                actorName: this.displayName,
                                actorTaskDescription: `This is new a new instance of React.Element ${this.displayName} process notifying its backing DisplayView cell that it has been mounted and is now activated.`,
                                actionRequest: { holistic: { common: { actions: { service: { html5: { display: { view: { linkDisplayProcess: { notifyEvent: "display-process-activated", reactElement: { displayName: this.displayName, displayPath: this.displayPath, thisRef: this } } } } } } } } } },
                                apmBindingPath: this.props.renderContext.apmBindingPath
                            });
                            try {
                                if (super.componentDidMount) {
                                    super.componentDidMount();
                                }
                            } catch (wtaf_) {
                                console.warn(wtaf_.message);
                                console.error(wtaf_.stack);
                            }

                            // ? Expect it to be fine for now as it's not being called yet.
                            this.componentWillUnmount = this.componentWillUnmount.bind(this);
                            this.foo = this.foo.bind(this);


                        }

                        /*
                        componentDidMount() {

                            console.log(`ViewDisplayProcess::componentDidMount on behalf of ${viewDisplayClassName}`);
                            let actResponse = this.props.renderContext.act({
                                actorName: this.displayName,
                                actorTaskDescription: `This is new a new instance of React.Element ${this.displayName} process notifying its backing DisplayView cell that it has been mounted and is now activated.`,
                                actionRequest: { holistic: { common: { actions: { service: { html5: { display: { view: { linkDisplayProcess: { notifyEvent: "display-process-activated", reactElement: { displayName: this.displayName, displayPath: this.displayPath, thisRef: this } } } } } } } } } },
                                apmBindingPath: this.props.renderContext.apmBindingPath
                            });
                            try {
                                if (super.componentDidMount) {
                                    super.componentDidMount();
                                }
                            } catch (wtaf_) {
                                console.warn(wtaf_.message);
                                console.error(wtaf_.stack);
                            }

                        }
                        */

                        componentWillUnmount() {
                            console.log(`ViewDisplayProcess::componentWillUnmount on behalf of ${viewDisplayClassName}`);
                            let actResponse = this.props.renderContext.act({
                                actorName: this.displayName,
                                actorTaskDescription: `This is a previously-linked React.Element ${this.displayName} process notifying its backing DisplayView cell that is is going to unmount and deactivate.`,
                                actionRequest: { holistic: { common: { actions: { service: { html5: { display: { view: { linkDisplayProcess: {  notifyEvent: "display-process-deactivating", reactElement: { displayName: this.displayName, thisRef: this } } } } } } } } } },
                                apmBindingPath: this.props.renderContext.apmBindingPath
                            });
                            try {
                                if (super.componentWillUnmount) {
                                    super.componentWillUnmount();
                                }
                            } catch (wtaf_) {
                                console.warn(wtaf_.message);
                                console.error(wtaf_.stack);
                            }
                        }

                        foo() {
                            console.log("Hello, foo here!");
                            return (<div>FOO</div>);
                        }


                    } // class DisplayProcess extends request_.reactComponentClass extends React.Component (presumably)

                    // ****************************************************************
                    // ****************************************************************
                    // SYNTHESIZE THE DISPLAY PROCESS REACT.COMPONENT
                    // ****************************************************************
                    // ****************************************************************

                    // WILL THIS WORK? :) MAGIC! (♥_♥)
                    function makeFascadeClass(fascadeClassName_) {
                        const fascadeClassConstructor = eval(`(function() { return (class ${fascadeClassName_} extends ViewDisplayProcess {}); })();`);
                        return fascadeClassConstructor;
                    }

                    // Syntheszie the fascade class.
                    fascadeClass = makeFascadeClass(viewDisplayClassName);

                })();

                // Now jam the synthesized fascade class into a a DisplayView cell process to ViewDisplay React.Element process transducer (aka d2r2Component ;)-~
                synthResponse = d2r2.ComponentFactory.request({
                    id: cmtDisplayView.mapLabels({ OTHER: `${request_.displayViewSynthesizeRequest.cellModelLabel}::ViewDisplay` }).result.OTHERID,
                    name: `${request_.displayViewSynthesizeRequest.cellModelLabel} ViewDisplay Process`,
                    description: "A filter that generates a React.Element instance created via React.createElement API from the reactComponentClass specified here bound to the request data.",
                    renderDataBindingSpec: { ...renderDataSpec },
                    reactComponent: fascadeClass // ᕕ( ᐛ )ᕗ
                });

                if (synthResponse.error) {
                    errors.push("Oh snap. Things were going so well... Unfortunately, we cannot synthesize a d2r2 React.Element synthesizer filter (d2r2Component) due to error:");
                    errors.push(synthResponse.error);
                    break;
                }

                const d2r2Component = synthResponse.result;

                console.log(`> Specialized ViewDisplay d2r2Component (React.Element factor filter) for cellModelLabel="${request_.displayViewSynthesizeRequest.cellModelLabel}" synthesized!`);

                // And, we're good?
                response.result = { CellModel: cellModel, d2r2Component };

                console.log("----------------------------------------------------------------");
                console.log(`> NEW DVVD BUS ARTIFACTS for cellModelLabel="${request_.displayViewSynthesizeRequest.cellModelLabel}":`);
                console.log(response);
                console.log("----------------------------------------------------------------");

                break;
            }
            if (errors.length) {
                errors.unshift("Unable to synthesize DisplayStream models due to fatal error:");
                response.error = errors.join(" ");
            }

            console.log(`[${this.operationID}::${this.operationName}] DVVD Bus generator request for cellModelLabel="${request_.displayViewSynthesizeRequest.cellModelLabel}" ${response.error?"FAILED WITH ERROR!":"completed without errror"}.`);
            console.log("////////////////////////////////////////////////////////////////");

            return response;
        }

    });

    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result // @encapsule/arccore.filter object

})();

