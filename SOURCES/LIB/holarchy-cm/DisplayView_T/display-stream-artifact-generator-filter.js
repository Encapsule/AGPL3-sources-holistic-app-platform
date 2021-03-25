// display-stream-artifact-generator-filter.js

// OMG ... Sorry, this module is likely to melt your brain.
// It is very terse given lack of time. We will expand it later and write tests
// for all the little pieces and try to ensure that all the names and labels etc.
// all get documented clearly etc. Lots of work to change the entire manner in
// which we build distributed information systems...

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
                console.log(`[${this.operationID}::${this.operationName}] Synthesizing new DisplayView <- d2r2 -> ViewDisplay process bus (d2r2 Bus) transceiver artifacts for cellModelLabel="${request_.displayViewSynthesizeRequest.cellModelLabel}"...`);

                // ****************************************************************
                // ****************************************************************
                // SYNTHESIZE A SPECIALIZED "DISPLAY VIEW" CellModel ARTIFACT
                // ****************************************************************
                // ****************************************************************

                // Part #1: Synthesize the CellModel constructor request descriptor.

                console.log(`> Attempting to synthesize a specialized DisplayView CellModel for cellModelLabel="${request_.displayViewSynthesizeRequest.cellModelLabel}"...`);

                let synthResponse = cmtDisplayView.synthesizeCellModel(request_.displayViewSynthesizeRequest);
                if (synthResponse.error) {
                    errors.push("The actual call to DisplayView_T::synthesizeCellModel failed with error:");
                    errors.push(synthResponse.error);
                    break;
                }

                const cellModelConstructorRequest = synthResponse.result;

                // Part #2: Construct a new CellModel class instance using the synthesized constructor request.

                const cellModel = new holarchy.CellModel(cellModelConstructorRequest);
                if (!cellModel.isValid()) {
                    errors.push("The CellModel::constructor request we received back from DisplayView_T::synthesizeCellModel is not a valid CellModel:");
                    errors.push(cellModel.toJSON());
                    break;
                }

                console.log(`> DisplayView CellModel for cellModelLabel="${request_.displayViewSynthesizeRequest.cellModelLabel}" synthesized!`);

                const apmIDDisplayView = cellModel.getAPM().getID(); // cellModelConstructorRequest.apm.ocdDataSpec.outputs.displayView.____appdsl.apm;

                // Must be kept in sync w/DVVD artifact generator. // ? Isn't this the artifact generator? I confuse myself here. // **** Check DisplayStreamMessage_T implementation re: this.renderData[X] OCD namespace details? I think this is what I was talking about here earlier.
                // I don't think this is perfect because I think you cannot go from this hex back to the IRUT due to IRUT performing char subst on base64. But, I do think it's idempotent and unique and that's likely good enough for our current use cases.

                const viewDisplayClassName = `${request_.displayViewSynthesizeRequest.cellModelLabel}_ViewDisplay_${Buffer.from(apmIDDisplayView, "base64").toString("hex")}`;
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

                            if (!this.displayName || (Object.prototype.toString.call(this.displayName) !== "[object String]") || !this.displayName.length) {
                                throw new Error(`Please set 'this.displayName' to a non-zero-length string value in your "${friendlyClassMoniker}::constructor" function.`); // Because the base class constructs and starts its lifecycle before we gain control back from super(props_).
                            }

                            this.displayPath = this.props.renderContext.displayPath;
                            this.linkedDisplayViewCell = null;

                            this.componentDidMount = this.componentDidMount.bind(this);
                            this.componentWillUnmount = this.componentWillUnmount.bind(this);
                            this.mountSubViewDisplay = this.mountSubViewDisplay.bind(this);
                            this.finalizeDisplayViewLink = this.finalizeDisplayViewLink.bind(this);

                        }

                        componentDidMount() {
                            // We are interested in if a newly constructed React.Element is _actually_ mounted in the VDOM.
                            console.log(`ViewDisplayProcess::constructor attempting to register ViewDisplay instance w/backing DisplayView cell on behalf of ${viewDisplayClassName}`);
                            let actResponse = this.props.renderContext.act({
                                actorName: this.displayName,
                                actorTaskDescription: `This is new a new instance of React.Element ${this.displayName} process notifying its backing DisplayView cell that it has been mounted and is now activated.`,
                                actionRequest: {
                                    holistic: {
                                        common: {
                                            actions: {
                                                service: {
                                                    html5: {
                                                        display: {
                                                            view: {
                                                                linkDisplayProcess: {
                                                                    notifyEvent: ((this.props.renderContext.d2r2BusState === "dv-root-active-vd-root-pending")?"vd-root-activated":"vd-child-activated"),
                                                                    reactElement: {
                                                                        displayName: this.displayName,
                                                                        displayPath: ((this.props.renderContext.d2r2BusState === "dv-root-active-vd-root-pending")?this.displayPath:this.props.renderContext.displayPath),
                                                                        displayInstance: this.props.renderContext.displayInstance,
                                                                        d2r2BusState: "ipc-link-pending",
                                                                        displayViewAPMID: this.props.renderContext.displayViewAPMID,
                                                                        thisRef: this
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                apmBindingPath: this.props.renderContext.apmBindingPath
                            });
                            if (actResponse.error) {
                                console.error("DisplayViewBase::linkDisplayProcess action request failed with error:");
                                console.error(actResponse.error);
                                // TODO: If we find that we are hitting this specific code path frequently and it's difficult/
                                // time-consuming for developers to root-cause/correct then we should work a little harder here
                                // to surface the error (precisely which of the available mechanism makes the most sense at the
                                // application layer and for application developers isn't entirely clear to me yet. So, we'll just
                                // console.error for now. Keep an eye on this please; if you end up here often please let me know.
                                return; //
                            }
                            // The developer-provided class we presume extends React.Component may or may not implement the onComponentDidMount React Component lifecycle method.
                            // If it does, then we delegate the call to our superclass and let it do whatever it needs to. Note, that I think in most cases React.Components
                            // written to leverage this mechanism will typically not implement componentDidMount as the primary motivation for doing this is to queue requests
                            // for data. And, we're effectively handling that with the action request above. But, we endeaver to change _nothing_ whatsoever about how a developer
                            // uses React. Instead, we provide opt-in extensions and tricks to do things that are quite difficult to build at scale (and then test at scale, and
                            // then extend at scale). In most cases, using holistic platform "display stream" protocol is mutually exclusive to overlapping React functionality.
                            // But, it's fine to use both techniques in the same app and at the same time in whatever combination befits needs I think so long as they're applied
                            // to different branches of the VDOM tree ;-)
                            try {
                                if (super.componentDidMount) {
                                    super.componentDidMount();
                                }
                            } catch (exception_) {
                                console.error(exception_.message);
                                console.error(exception_.stack);
                            }
                        }

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
                            } catch (exception_) {
                                console.warn(exception_.message);
                                console.error(exception_.stack);
                            }
                        }

                        mountSubViewDisplay({ cmasScope, displayViewCellModelLabel, displayInstance, displayLayout }) {
                            const apmID_DisplayViewCell = request_.displayViewSynthesizeRequest.cmasScope.mapLabels({ APM: displayViewCellModelLabel }).result.APMID;
                            const hexifiedAPMID = Buffer.from(apmID_DisplayViewCell, "base64").toString("hex");
                            const layoutNamespace = (`${displayViewCellModelLabel}_ViewDisplay_${hexifiedAPMID}`);
                            let renderData = {};
                            renderData[layoutNamespace] = displayLayout;
                            const ComponentRouter = this.props.renderContext.ComponentRouter;
                            return (<ComponentRouter
                                    {...this.props}
                                    renderContext={{
                                        ...this.props.renderContext,
                                        d2r2BusState: "vd-process-dynamic-mount",
                                        displayPath: `${this.displayPath}.${displayInstance}`, // this.props.renderContext.displayPath,
                                        displayInstance: displayInstance,
                                        displayViewAPMID: apmID_DisplayViewCell,
                                    }} renderData={renderData} />
                                   );
                        }

                        finalizeDisplayViewLink({ apmBindingPath }) {
                            this.linkedDisplayViewCell = apmBindingPath;
                            this.forceUpdate();
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
                    id: request_.displayViewSynthesizeRequest.cmasScope.mapLabels({ OTHER: `${request_.displayViewSynthesizeRequest.cellModelLabel}::ViewDisplay` }).result.OTHERID,
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
                const displayViewAPMRef = response.result.CellModel.getAPM();
                console.log(`[${response.result.CellModel.getID()}::${response.result.CellModel.getName()}] APM ID = "${response.result.CellModel.getAPM().getID()}"`);
                console.log("response===");
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

