// app-view-render-d3-examples.js
//
// This filter specification defines the format of data to be
// passed from a Holism app server service filter into the HTML
// rendering subsystem. The signature of this message will be
// routed by the HTML rendering subsystem to the AppViewD3Examples
// React component for rendering.

module.exports = {
    ____types: "jsObject",
    appView_D3Examples: {
        ____label: "D3 Examples Render Request",
        ____types: "jsObject",
        udpate: {
            ____label: "Update Counter",
            ____description: "Numerical counter used to filter updates of the contained D3 visualization.",
            ____accept: "jsNumber",
            ____defaultValue: 0
        },
        pieChartData: {
            ____label: "Pie Chart Data",
            ____description: "An array of data to display in a pie chart D3 visualization.",
            ____types: "jsArray",
            element: {
                ____label: "Pie Chart Data Point",
                ____description: "A specific data point to render in our pie chart visualization.",
                ____accept: "jsNumber"
            }
        }
    }
};
