// AppViewARCcoreFilterExamples.jsx

const arccore = require('arccore');
const React = require('react');
const HolisticIconPageHeader = require('../common/HolisticIconPageHeader.jsx');

const jsonParseErrorStyles = {
    fontSize: '10pt',
    color: 'red',
    fontWeight: 'bold'
};

const bodyFunctions = [
    {
        name: "Passthrough",
        description: "Pass the `request` through to `response.result` without modification. Note that this is filter's default behavior if bodyFunction is not specified.",
        bodyFunction: function(request) { return { error: null, result: request }; }
    },
    {
        name: "Length of request",
        description: "Return the value of `request.length` via `response.result`.",
        bodyFunction: function(request) {
            var response = { error: null, result: null };
            try {
                response.result = request.length;
                if (response.result === undefined) {
                    response.error = "Expected request.length property value to be an integer but it's undefined!";
                }
            } catch (exception) {
                response.error = "Handled exception: " + exception.toString();
            }
            return response;
        }
    }

];

export class AppViewARCcoreFilterExamples extends React.Component {

    constructor(props_) {
        super(props_);
        const thisPageData = this.props.document.data.appView_ARCcoreFilterExamples;
        this.state = {
            operationID: 'demo',
            operationName: 'Demo Filter',
            operationDescription: 'A simple interactive filter object demo.',
            inputFilterSpecSelect: 0,
            inputFilterSpecName: thisPageData.inputFilterSpecs[0].name,
            inputFilterSpecDescription: thisPageData.inputFilterSpecs[0].description,
            inputFilterSpec: JSON.stringify(thisPageData.inputFilterSpecs[0].data, undefined, 4),
            inputFilterSpecError: null,
            outputFilterSpecSelect: 0,
            outputFilterSpecName: thisPageData.outputFilterSpecs[0].name,
            outputFilterSpecDescription: thisPageData.outputFilterSpecs[0].description,
            outputFilterSpec: JSON.stringify(thisPageData.outputFilterSpecs[0].data, undefined, 4),
            outputFilterSpecError: null,
            bodyFunctionSelect: 0,
            bodyFunctionName: bodyFunctions[0].name,
            bodyFunction: bodyFunctions[0].bodyFunction,
            bodyFunctionDescription: bodyFunctions[0].description,
            factoryResponse: JSON.stringify({ error: null, result: null }, undefined, 4),
            requestDataSelect: 0,
            requestDataName: thisPageData.inputRequestData[0].name,
            requestDataDescription: thisPageData.inputRequestData[0].description,
            requestData: JSON.stringify(thisPageData.inputRequestData[0].data, undefined, 4),
            requestDataError: null
        };

        this.reevaluateInputs = this.reevaluateInputs.bind(this);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.onSelectInputFilterSpec = this.onSelectInputFilterSpec.bind(this);
        this.onSelectBodyFunction = this.onSelectBodyFunction.bind(this);
        this.onSelectOutputFilterSpec = this.onSelectOutputFilterSpec.bind(this);
        this.onSelectInputData = this.onSelectInputData.bind(this);
        // ?lifecycle method bind? this.componentDidMount = this.onComponentDidMount.bind(this);
        this.createOperationID = this.createOperationID.bind(this);


    } // end constructor

    reevaluateInputs() {
        var state = this.state;

        var filterFactoryInput = {
            operationID: state.operationID,
            operationName: state.operationName,
            operationDescription: state.operationDescription,
            inputFilterSpec: null,
            bodyFunction: state.bodyFunction,
            outputFilterSpec: null
        };

        var requestData = null;

        try {
            filterFactoryInput.inputFilterSpec = (state.inputFilterSpec !== undefined)?JSON.parse(state.inputFilterSpec):undefined;
            state.inputFilterSpecError = null;
        } catch (exception_) {
            state.inputFilterSpecError = exception_.message;
        }

        try {
            filterFactoryInput.outputFilterSpec = (state.outputFilterSpec !== undefined)?JSON.parse(state.outputFilterSpec):undefined;
            state.outputFilterSpecError = null;
        } catch (exception_) {
            state.outputFilterSpecError = exception_.message;
        }

        try {
            requestData = (state.requestData !== undefined)?JSON.parse(state.requestData):undefined;
            state.requestDataError = null;
        } catch (exception_) {
            state.requestDataError = exception_.message;
        }

        if (state.inputFilterSpecError || state.outputFilterSpecError) {
            state.factoryResponse = { error: "Filter factory not called due to JSON error(s) in the form!", result: null };
            state.filterResponse = { error: "No runtime filter produced by filter factory!", result: null };
        } else {
            state.factoryResponse = arccore.filter.create(filterFactoryInput);
            if (!state.factoryResponse.error) {
                if (state.requestDataError) {
                    state.filterResponse = { error: "Filter runtime not called due to JSON error in the form!", result: null };
                } else {
                    state.filterResponse = state.factoryResponse.result.request(requestData);
                }
            } else {
                state.filterResponse = { error: "No runtime filter produced by filter factory!", result: null };
            }
        }
        state.factoryResponse = JSON.stringify(state.factoryResponse, undefined, 4);
        state.filterResponse = JSON.stringify(state.filterResponse, undefined, 4);
        this.setState(state);
    }

    onTextInputChange(event_) {

        console.log("event.target.name='" + event_.target.name + "'");
        console.log("event.target.value'" + event_.target.value + "'");

        var state = this.state;
        state[event_.target.name] = event_.target.value;
        this.reevaluateInputs();

    }

    onSelectInputFilterSpec(event_) {
        const thisPageData = this.props.document.data.appView_ARCcoreFilterExamples;
        var index = parseInt(event_.target.value);
        var state = this.state;
        state.inputFilterSpecSelect = index;
        state.inputFilterSpecName = thisPageData.inputFilterSpecs[index].name;
        state.inputFilterSpecDescription = thisPageData.inputFilterSpecs[index].description;
        state.inputFilterSpec = JSON.stringify(thisPageData.inputFilterSpecs[index].data, undefined, 4);
        this.setState(state);
        this.reevaluateInputs();
    }

    onSelectBodyFunction(event_) {
        var index = parseInt(event_.target.value);
        var state = this.state;
        state.bodyFunctionSelect = index;
        state.bodyFunctionName = bodyFunctions[index].name;
        state.bodyFunctionDescription = bodyFunctions[index].description;
        state.bodyFunction = bodyFunctions[index].bodyFunction;
        this.setState(state);
        this.reevaluateInputs();
    }

    onSelectOutputFilterSpec(event_) {
        const thisPageData = this.props.document.data.appView_ARCcoreFilterExamples;
        var index = parseInt(event_.target.value);
        var state = this.state;
        state.outputFilterSpecSelect = index;
        state.outputFilterSpecName = thisPageData.outputFilterSpecs[index].name;
        state.outputFilterSpecDescription = thisPageData.outputFilterSpecs[index].description;
        state.outputFilterSpec = JSON.stringify(thisPageData.outputFilterSpecs[index].data, undefined, 4);
        this.setState(state);
        this.reevaluateInputs();
    }

    onSelectInputData(event_) {
        const thisPageData = this.props.document.data.appView_ARCcoreFilterExamples;
        var index = parseInt(event_.target.value);
        var state = this.state;
        state.requestDataSelect = index;
        state.requestDataName = thisPageData.inputRequestData[index].name;
        state.requestDataDescription = thisPageData.inputRequestData[index].description;
        state.requestData = JSON.stringify(thisPageData.inputRequestData[index].data, undefined, 4);
        this.setState(state);
        this.reevaluateInputs();
    }

    componentDidMount() {
        this.reevaluateInputs();
    }

    createOperationID() {
        var state = this.state;
        state.operationID = arccore.identifier.irut.fromEther();
        this.setState(state);
        this.reevaluateInputs();
    }

    render() {

        const thisPageData = this.props.document.data.appView_ARCcoreFilterExamples;
        const thisPageMetadata = this.props.document.metadata.page;

        var key = 0;
        function makeKey() { return ("ARCcoreFilterExample" + key++); }

        var index = 0;
        // Create the input filter specification selection form input.
        var inputFilterSpecOptions = [];
        for (var inputFilterSpecDescriptor of thisPageData.inputFilterSpecs) {
            inputFilterSpecOptions.push(<option key={makeKey()} value={index++}>{inputFilterSpecDescriptor.name}</option>);
        }
        var inputFilterSpecSelect = (<select name="inputFilterSpecSelect" onChange={this.onSelectInputFilterSpec}>{inputFilterSpecOptions}</select>);

        // Create the bodyFunction selection form input.
        var bodyFunctionOptions = [];
        index = 0;
        for (var bodyFunctionDescriptor of bodyFunctions) {
            bodyFunctionOptions.push(<option key={makeKey()} value={index++}>{bodyFunctionDescriptor.name}</option>);
        }
        var bodyFunctionSelect = (<select name="bodyFunctionSelect" onChange={this.onSelectBodyFunction}>{bodyFunctionOptions}</select>);

        // Create the output filter specification selection form input.
        var outputFilterSpecOptions = [];
        index = 0;
        for (var outputFilterSpecDescriptor of thisPageData.outputFilterSpecs) {
            outputFilterSpecOptions.push(<option key={makeKey()} value={index++}>{outputFilterSpecDescriptor.name}</option>);
        }
        var outputFilterSpecSelect = (<select name="outputFilterSpecSelect" onChange={this.onSelectOutputFilterSpec}>{outputFilterSpecOptions}</select>);

        // Create the input data selection form input.
        var inputDataOptions = [];
        index = 0;
        for (var inputDataDescriptor of thisPageData.inputRequestData) {
            inputDataOptions.push(<option key={makeKey()} value={index++}>{inputDataDescriptor.name}</option>);
        }
        var inputDataSelect = (<select name="inputDataSelect" onChange={this.onSelectInputData}>{inputDataOptions}</select>);

        var content = [];

        content.push(<h2 key={makeKey()}>Filter Factory</h2>);
        content.push(<p key={makeKey()}>A filter object instance is contructed by calling factory function <code>ARCcore.filter.create</code>.</p>);

        content.push(<h4 key={makeKey()}>Operation ID</h4>);
        content.push(<span key={makeKey()}><textarea key={makeKey()} name="operationID" cols="22" rows="1" value={this.state.operationID} onChange={this.onTextInputChange}></textarea>
                     <br /><button onClick={this.createOperationID}>Create ID</button></span>);

        content.push(<h4 key={makeKey()}>Operation Name</h4>);
        content.push(<textarea key={makeKey()} name="operationName" cols="80" rows="1" value={this.state.operationName} onChange={this.onTextInputChange}></textarea>);

        content.push(<h4 key={makeKey()}>Operation Description</h4>);
        content.push(<textarea key={makeKey()} name="operationDescription" cols="80" rows="1" value={this.state.operationDescription} onChange={this.onTextInputChange}></textarea>);

        content.push(<h4 key={makeKey()}>Input Filter Spec (JSON)</h4>);
        content.push(<span key={makeKey()}>{inputFilterSpecSelect}<br /></span>);
        content.push(<span key={makeKey()}>{this.state.inputFilterSpecDescription}<br /></span>);
        content.push(<textarea key={makeKey()} name="inputFilterSpec" cols="80" rows="8" value={this.state.inputFilterSpec?this.state.inputFilterSpec:""} onChange={this.onTextInputChange}></textarea>);
        if (this.state.inputFilterSpecError) {
            content.push(<p key={makeKey()} style={jsonParseErrorStyles}><strong>{this.state.inputFilterSpecError}</strong></p>);
        }

        content.push(<h4 key={makeKey()}>Body Function</h4>);
        content.push(<span key={makeKey()}>{bodyFunctionSelect}<br /></span>);
        content.push(<span key={makeKey()}>{this.state.bodyFunctionDescription}<br /></span>);
        content.push(<pre key={makeKey()}>{this.state.bodyFunction.toString()}</pre>);

        content.push(<h4 key={makeKey()}>OutputFilter Spec (JSON)</h4>);
        content.push(<span key={makeKey()}>{outputFilterSpecSelect}<br /></span>);
        content.push(<span key={makeKey()}>{this.state.outputFilterSpecDescription}<br /></span>);
        content.push(<textarea key={makeKey()} name="outputFilterSpec" cols="80" rows="5" value={this.state.outputFilterSpec?this.state.outputFilterSpec:""} onChange={this.onTextInputChange}></textarea>);
        if (this.state.outputFilterSpecError) {
            content.push(<p key={makeKey()} style={jsonParseErrorStyles}><strong>{this.state.outputFilterSpecError}</strong></p>);
        }

        content.push(<h4 key={makeKey()}>Filter Factory Output Response (JSON)</h4>);
        if (this.state.factoryResponse.error) {
            content.push(<p key={makeKey()}><strong>Unable to construct a filter instance due to factory error!</strong></p>);
        } else {
            content.push(<p key={makeKey()}><strong>Filter instance constructed!</strong> Note that method <code>request</code> is not shown in serialized JSON below.</p>);
        }

        content.push(<pre key={makeKey()}>{this.state.factoryResponse}</pre>);

        content.push(<h2 key={makeKey()}>Filter Runtime</h2>);

        content.push(<h4 key={makeKey()}>Filter Input Request Data (JSON)</h4>);
        content.push(<span key={makeKey()}>{inputDataSelect}<br /></span>);
        content.push(<span key={makeKey()}>{this.state.requestDataDescription}<br /></span>);
        content.push(<textarea key={makeKey()} name="requestData" cols="80" rows="5" value={this.state.requestData?this.state.requestData:""} onChange={this.onTextInputChange}></textarea>);
        if (this.state.requestDataError) {
            content.push(<p key={makeKey()} style={jsonParseErrorStyles}><strong>{this.state.requestDataError}</strong></p>);
        }

        content.push(<h4 key={makeKey()}>Filter Output Response Data (JSON)</h4>);
        content.push(<pre key={makeKey()}>{this.state.filterResponse}</pre>);

        return (<div>
                <HolisticIconPageHeader svg={thisPageMetadata.icons.svg} title={thisPageMetadata.contentTitle} subtitle={thisPageMetadata.contentSubtitle} />

                <p>This is an interactive demo and simulation of the ARCcore.filter library.</p>

                <p>Changing any of the form inputs below will immediately re-evaluate the simulation and update the results (or errors).</p>

                {content}
                </div>)

    } // end render method

} // end class AppViewARCcoreFilterExamples

