// sources/common/view/component-router/ComponentRouter.jsx
// Looking for this module inside a large webpack bundle? Search for "SmNzf5U0RXSSyXe06mTRCg".

const React = require("react");
const arccore = require("@encapsule/arccore");

module.exports = function(dataViewBindingDiscriminator_, dataViewBindingFilters_) {

    class ComponentRouter extends React.Component {

        constructor(props_) {
            super(props_);
        } // constructor

        render() {

            try {

                var self = this;

                let errors = [];
                let inBreakScope = false;
                while (!inBreakScope) {
                    inBreakScope = true;

                    const routingDataContext = {
                        reactContext: this.props,
                        renderData: this.props.renderData
                    };

                    //////////////////////////////////////////////////////////////////////////
                    // SELECT: Match the namespace:type-derived signature of routingDataContext.renderData to 1:N registered React component data binding filters.

                    let discriminatorResponse = dataViewBindingDiscriminator_.request(routingDataContext);

                    if (discriminatorResponse.error) {
                        errors.push("Failed to find a suitable d2r2 component based on type signature analysis of this.props.renderData. Check your d2r2 component registrations and d2r2 renderData request signature.");
                        break;
                    }

                    const targetViewBindingFilter = discriminatorResponse.result;

                    //////////////////////////////////////////////////////////////////////////
                    // DISPATCH: Call the React component data binding filter to generate an instance of its encapsulated React component that is bound to this input data.

                    var targetFilterResponse = targetViewBindingFilter.request(routingDataContext);

                    if (targetFilterResponse.error) {
                        errors.push("The selected d2r2 component failed during delegation:");
                        errors.push(targetFilterResponse.error);
                        break;
                    }

                    return targetFilterResponse.result;
                    break;

                } // end while

                const errorMessage = errors.join(" ");

                //////////////////////////////////////////////////////////////////////////
                // ERROR: The input data does not have an acceptable namespace:type format.

                console.error("!!!!! <ComponentRouter/> ERROR: " + errorMessage);

                // Pre-render a JSON-format copy of the specific `this.props.renderData` we cannot identify. Note that we only print out this.props.renderData because typically this all that matters to developers.
                const renderDataJSON = ((this.props.renderData === undefined)?("this.props.renderData === undefined"):(`this.props.renderData === "${JSON.stringify({ renderData: this.props.renderData }, undefined, 4)}"`));

                return (<div style={{ backgroundColor: "red", fontFamily: "Play", padding: "1em", overflow: "auto" }}>
                        <div style={{ fontSize: "largest", fontWeight: "bold" }}>&lt;ComponentRouter/&gt; Error</div>
                        <br/>
                        <div>
                        &lt;ComponentRouter/&gt; cannot render <code>this.props.renderData</code> due to delegation errror.<br/>
                        </div>
                        <br/>
                        <div style={{ marginTop: "1em", marginBottom: "1em" }}>
                        <div style={{ fontFamily: "monospace", whiteSpace: "pre", padding: "1em", backgroundColor: "rgba(255,255,255,0.4)", overflow: "auto" }}>{renderDataJSON}</div>
                        </div>
                        <div style={{ marginTop: "1em", marginBottom: "1em" }}>
                        <div style={{ fontFamily: "monospace", whiteSpace: "pre", padding: "1em", backgroundColor: "rgba(255,255,255,0.4)", overflow: "auto" }}>{`response.error === "${errorMessage}"`}</div>
                        </div>
                        </div>);

            } catch (exception_) {

                return (<div style={{ backgroundColor: "#FFCC00", fontFamily: "Play", padding: "1em", overflow: "auto" }}>
                        <div style={{ fontSize: "largest", fontWeight: "bold" }}>&lt;ComponentRouter/&gt; INTERNAL ERROR</div>
                        <br/>
                        <div>Unfortunately, there has been an internal error inside the &lt;ComponentRouter&gt; error handling logic that is preventing us from correctly displaying the our standard error and diagnostic view.</div>
                        <br/>
                        <div style={{ marginTop: "1em", marginBottom: "1em" }}>
                        <div style={{ fontFamily: "monospace", whiteSpace: "pre", padding: "1em", backgroundColor: "rgba(255,255,255,0.4)" }}>{exception_.stack}</div>
                        </div>
                        </div>);
            } // end catch

        } // end method render

    }

    // Return the React.Component-derived ComponentRouter class that's specialized for this applicaiton's registered DataRoutableComponent definitions.
    return ComponentRouter;

}; // end module.exports = function(dataViewBindingDiscriminator_, dataViewBindingFilters_)
