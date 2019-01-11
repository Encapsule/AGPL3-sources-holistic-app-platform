// AppViewD3Examples.jsx
//

const React = require('react');
const HolisticIconPageHeader = require('../common/HolisticIconPageHeader.jsx');
const d3 = require('d3');

module.exports = class AppViewD3Examples extends React.Component {

    constructor(props_) {
        super(props_);
        this.state = { d3width: 1024, d3height: 500 };
        this.onWindowResize = this.onWindowResize.bind(this);
        this.createD3 = this.createD3.bind(this);
        this.updateD3 = this.updateD3.bind(this);
        // ?? this.componentDidMount = this.componentDidMount.bind(this);
        // ?? this.componentWillUnmount = this.componentWillUnmount.bind(this);
        // ?? this.componentShouldUpdate = this.componentShouldUpdate.bind(this);
        // ?? this.componentDidUpdate = this.componentDidUpdate.bind(this);
    } // end constructor

    onWindowResize() { 
        // this.setState({ d3width: Math.floor(window.innerWidth/2), d3height: Math.floor(window.innerHeight/2) });
        var state = {
            d3width: this.refs.d3PageContainer.clientWidth,
            d3height: 500 // this.refs.d3PageContainer.clientHeight
        };
        this.setState(state);
    }

    createD3() {

        console.log("Executing createD3 function...");

        var thisPageData = this.props.document.data.appView_D3Examples;
        var pieChartData = thisPageData.pieChartData;

        var xScale = d3.scaleLinear().domain([0, pieChartData.length-1]).range([100, this.state.d3width-100]);
        var yScale = d3.scaleLinear().domain([-200, 200]).range([100, this.state.d3height-100]);

        var axisDataArray = [
            {
                axis: d3.axisTop(xScale),
                transform: {
                    x: 0,
                    y: 100
                }
            },
            {
                axis: d3.axisBottom(xScale),
                transform: {
                    x: 0,
                    y: this.state.d3height - 100
                }
            },
            {
                axis: d3.axisLeft(yScale),
                transform: {
                    x: 100,
                    y: 0
                }
            },
            {
                axis: d3.axisRight(yScale),
                transform: {
                    x: this.state.d3width - 100,
                    y: 0
                }
            }
        ]; // axisDataArray

        var svg = d3.select(this.refs.d3Example1);

        var circles = svg.selectAll('circle').data(pieChartData);
        var circlesEnter = circles.enter().append('circle');
        circles.
            attr("cx", function(d,i) { return xScale(i); }).
            attr("cy", (this.state.d3height / 2)).
            attr("r", function(d) { return d; }).
            attr("stroke", "red").attr("fill", "none").attr("stoke-width", "1");


        function translate(index) {
            return (
                "translate(" +
                    axisDataArray[index].transform.x +
                    "," +
                    axisDataArray[index].transform.y +
                    ")"
            );
        } // translate

        svg.append("g").attr("id", "idTopAxis").call(axisDataArray[0].axis).attr("transform", translate(0));
        svg.append("g").attr("id", "idBottomAxis").call(axisDataArray[1].axis).attr("transform", translate(1));
        svg.append("g").attr("id", "idLeftAxis").call(axisDataArray[2].axis).attr("transform", translate(2));
        svg.append("g").attr("id", "idRightAxis").call(axisDataArray[3].axis).attr("transform", translate(3));


        var topAxis = svg.select("#idTopAxis").call(axisDataArray[0].axis).attr("transform", translate(0));
        var bottomAxis = svg.select("#idBottomAxis").call(axisDataArray[1].axis).attr("transform", translate(1));
        var leftAxis = svg.select("#idLeftAxis").call(axisDataArray[2].axis).attr("transform", translate(2));
        var rightAxis = svg.select("#idRightAxis").call(axisDataArray[3].axis).attr("transform", translate(3));

        var border = svg.selectAll('rect').data([ this.state ]);
        var borderEnter = border.enter().append('rect').attr("id", "idBorder");
        border.attr("x", 0).attr("y", 0).
            attr("width", this.state.d3width).
            attr("height", this.state.d3height).
            attr("stroke", "blue").attr("fill", "none").attr("stroke-width", "1");


    }

    updateD3() {
        console.log("updateD3 called...");
        this.createD3();
    }

    componentDidMount() {
        // Cache the update counter value from the document data passed into the HTML render subsystem.
        this.update = this.props.document.data.appView_D3Examples.update;
        window.addEventListener('resize', this.onWindowResize, false);
        this.onWindowResize();
        this.createD3();
    }

    componentWillUnmount() {
        console.log("D3 examples componentDidUnmount");
        window.removeEventListener('resize', this.onWindowResize, false);
    }

    shouldComponentUpdate(nextProps_, nextState_) {
        if (
            (this.update !== nextProps_.document.data.appView_D3Examples.update)
            ||
            ((this.state.d3width !== nextState_.d3width) || (this.state.d3height !== nextState_.d3height))
        )
        {
            console.log("D3 examples host reacting to updated properties... ");
            return true;
        } else {
            return false;
        }
    }

    componentDidUpdate() {
        console.log("D3 examples componentDidUpdate");
        this.updateD3();
    }

    render() {

        var thisPageMetadata = this.props.document.metadata.page;
        var thisPageData = this.props.document.data.appView_D3Examples;

        var index = 0;
        function makeKey() { return ("AppViewD3Examples" + index++); }

        var content = [];

        content.push(<HolisticIconPageHeader key={makeKey()}
                     svg={thisPageMetadata.icons.svg} title={thisPageMetadata.contentTitle}
                     subtitle={thisPageMetadata.contentSubtitle} />);

        content.push(<p key={makeKey()}>This is a test page for experimenting with the <a href="https://d3js.org"><strong>D3js</strong></a> library.</p>);

        content.push(<p key={makeKey()}>d3width: {this.state.d3width} d3height: {this.state.d3height}</p>);

        content.push(<svg key={makeKey()} id="idAppViewD3Example1" ref="d3Example1"
                     width={this.state.d3width + 'px'} height={this.state.d3height + 'px'}></svg>);

        return (<div id="idAppViewD3Examples" ref="d3PageContainer">{content}</div>);

    } // end render method
    
} // end class AppViewD3Examples


