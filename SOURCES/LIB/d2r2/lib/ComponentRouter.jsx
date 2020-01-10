// sources/common/view/component-router/ComponentRouter.jsx
// Looking for this module inside a large webpack bundle? Search for "SmNzf5U0RXSSyXe06mTRCg".

const React = require("react");
const arccore = require("@encapsule/arccore");

module.exports = function(dataViewBindingDiscriminator_, dataViewBindingFilters_) {

    var keyIndex = 500;
    function makeKey() { return ("ComponentRouter" + keyIndex++); }

    const dataViewBindingDiscriminator = dataViewBindingDiscriminator_;
    const dataViewBindingFilters = dataViewBindingFilters_;

    var filterNameList = [];
    var filterNameMap = {};
    var filterIDMap = {};

    dataViewBindingFilters.forEach(function(dataViewBindingFilter_) {
        const filterName = dataViewBindingFilter_.filterDescriptor.operationID + '::' + dataViewBindingFilter_.filterDescriptor.operationName;
        filterNameList.push(filterName);
        filterNameMap[filterName] = dataViewBindingFilter_;
        filterIDMap[dataViewBindingFilter_.filterDescriptor.operationID] = dataViewBindingFilter_;
    });

    filterNameList.sort(function(a, b) {
        var aName = a.split('::')[1];
        var bName = b.split('::')[1];
        var disposition = ((aName > bName)?1:((aName === bName)?0:-1))
        return disposition;
    });

    class ComponentRouter extends React.Component {

        constructor(props_) {
            super(props_);
            this.state = {};
            this.onToggleInspectViewBindingFilter = this.onToggleInspectViewBindingFilter.bind(this);
            this.onMouseOverBindingFilter = this.onMouseOverBindingFilter.bind(this);
            this.onMouseOutBindingFinder = this.onMouseOutBindingFilter.bind(this);
        } // constructor

        onToggleInspectViewBindingFilter(filterName_) {
            var state = this.state;
            if (!state[filterName_])
                state[filterName_] = {};

            if (state[filterName_].inspect)
                delete state[filterName_].inspect;
            else
                state[filterName_].inspect = filterNameMap[filterName_];
            this.setState(state);
        }

        onMouseOverBindingFilter(filterName_) {
            var state = this.state;
            state.mouseOver = filterName_;
            this.setState(state);
        }

        onMouseOutBindingFilter(filterName_) {
            var state = this.state;
            delete state.mouseOver;
            this.setState(state);
        }

        render() {

            try {

                var self = this;

                keyIndex = 0;

                var error = null;

                const routingDataContext = {
                    reactContext: this.props,
                    renderData: this.props.renderData
                };

                //////////////////////////////////////////////////////////////////////////
                // SELECT: Match the namespace:type-derived signature of routingDataContext.renderData to 1:N registered React component data binding filters.

                var discriminatorResponse = dataViewBindingDiscriminator.request(routingDataContext);

                if (!discriminatorResponse.error) {

                    const targetFilterID = discriminatorResponse.result;
                    var targetViewBindingFilter = filterIDMap[targetFilterID];

                    /*
                    console.log([
                        "..... <ComponentRouter/> dispatching to [",
                        targetViewBindingFilter.filterDescriptor.operationID,
                        "::",
                        targetViewBindingFilter.filterDescriptor.operationName,
                        "]"
                    ].join(''));
                    */

                    //////////////////////////////////////////////////////////////////////////
                    // DISPATCH: Call the React component data binding filter to generate an instance of its encapsulated React component that is bound to this input data.

                    var targetFilterResponse = targetViewBindingFilter.request(routingDataContext);

                    if (!targetFilterResponse.error)
                        // Data-bound React component produced by calling the selected React component data binding filter.
                        return targetFilterResponse.result;
                    else
                        // ARCcore.discriminator rejects requests that it can not plausibly match to 1:N registered filters
                        // while simultaneously eliminating the other N-1 filters. But, it does this by performing as few
                        // operations as possible. This means that the selected filter is selected because all the others
                        // will definitely reject this request. And, as it turns out it doesn't much like this request.
                        error = targetFilterResponse.error;
                } else {
                    error = discriminatorResponse.error;
                }

                //////////////////////////////////////////////////////////////////////////
                // ERROR: The input data does not have an acceptable namespace:type format.

                console.error("!!!!! <ComponentRouter/> ERROR: " + error);

                const theme = this.props.document.metadata.site.theme;

                // Pre-render a JSON-format copy of the specific `this.props.renderData` we cannot identify.
                const renderDataJSON =
                      ((this.props.renderData === undefined)?(<span key={makeKey()}>undefined</span>):(<span key={makeKey()}>'{JSON.stringify(this.props.renderData, undefined, 4)}'</span>));

                const supportedFilterListItems = [];
                filterNameList.forEach(function(filterName_) {
                    var filterName = filterName_;
                    var listItemContent = [];
                    var clickHandler = function() { self.onToggleInspectViewBindingFilter(filterName); }
                    var onMouseOverHandler = function() { self.onMouseOverBindingFilter(filterName); }
                    var onMouseOutHandler = function() { self.onMouseOutBindingFilter(filterName); }

                    var filterNameStyles = {};
                    if (self.state.mouseOver === filterName) {
                        filterNameStyles = arccore.util.clone(theme.ComponentRouterError.filterListItemMouseOver);
                    } else {
                        if (self.state[filterName_] && self.state[filterName_].inspect) {
                            filterNameStyles = arccore.util.clone(theme.ComponentRouterError.filterListItemInspect);
                        } else {
                            filterNameStyles = arccore.util.clone(theme.ComponentRouterError.filterListItem);
                        }
                    }

                    if (!self.state[filterName_] || !self.state[filterName_].inspect) {
                        filterNameStyles.cursor = 'zoom-in';
                        listItemContent.push(<span key={makeKey()} style={filterNameStyles} onClick={clickHandler} onMouseOver={onMouseOverHandler} onMouseOut={onMouseOutHandler}>
                                             [{filterName_}]
                                             </span>);
                    } else {
                        filterNameStyles.cursor = 'zoom-out';
                        listItemContent.push(<span key={makeKey()}>
                                             <span style={filterNameStyles} onClick={clickHandler}  onMouseOver={onMouseOverHandler} onMouseOut={onMouseOutHandler}>[{filterName_}]</span>
                                             <br/><br/>
                                             <pre style={theme.classPRE} onMouseOver={onMouseOutHandler} onMouseOut={onMouseOutHandler}>{JSON.stringify(filterNameMap[filterName_], undefined, 4)}</pre>
                                             <br/>
                                             </span>);
                    }
                    supportedFilterListItems.push(<li key={makeKey()}>{listItemContent}</li>);
                });

                return (<div style={theme.ComponentRouterError.container}>
                        <h1>&lt;ComponentRouter/&gt; Error</h1>
                        <p>&lt;ComponentRouter/&gt; cannot render the value of <code>this.props.renderData</code> it received because its
                        {' '}<strong>namespace::type</strong>-derived data signature does not meet the input filter specification criteria of any of the React
                        {' '}component data binding filters registered by this application.</p>
                        <h2>Unrecognized this.props.renderData (JSON):</h2>
                        <pre style={theme.classPRE}>this.props.renderData === {renderDataJSON}</pre>
                        <h2>Underlying ARCcore.discriminator Error</h2>
                        <pre style={theme.classPRE}>{error}</pre>
                        <h2>Registered React Components:</h2>
                        <p>To correct this problem, please ensure that the value passed to &lt;ComponentRouter/&gt; via its <code>renderData</code> property has
                        {' '}a <strong>namespace::type</strong>-derived signature accepted by one of the following data-bound React components:</p>
                        <ol style={theme.ComponentRouterError.filterList}>{supportedFilterListItems}</ol>
                        </div>);

            } catch (exception_) {
                let theme = this.props.document.metadata.site.theme; // .ComponentRouterError.container;
                return (<div style={theme.ComponentRouterError.container}>
                        <h1>&lt;ComponentRouter/&gt; INTERNAL ERROR</h1>
                        <p>Unfortunately, there has been an internal error inside the &lt;ComponentRouter&gt; error handling logic that is preventing us from correctly displaying the our standard error and diagnostic view.</p>
                        <pre style={theme.classPRE}>{exception_.stack}</pre>
                        </div>);
            } // end catch

        } // end method render

    }

    // Return the React.Component-derived ComponentRouter class that's specialized for this applicaiton's registered DataRoutableComponent definitions.
    return ComponentRouter;

}; // end module.exports = function(dataViewBindingDiscriminator_, dataViewBindingFilters_)
