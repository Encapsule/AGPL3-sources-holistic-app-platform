// content-view-data-binding-filter-factory.js

const arccore = require('arccore');
const React = require('react');
const contentViewRegistrationSpec = require('./iospecs/content-view-registration-spec');

var factoryResponse = arccore.filter.create({
    operationID: "QSFGMUwaTtWW36j9SVV_dw",
    operationName: "Content View Data Binding Filter Factory",
    operationDescription: "Constructs a view content data binding filter.",
    inputFilterSpec: contentViewRegistrationSpec,
    outputFilterSpec: {
        ____label: "View Content Router Filter",
        ____description: "A view content routing filter for registration with the content router discriminator filter.",
        ____types: "jsObject",
        filterDescriptor: { ____accept: "jsObject" },
        request: { ____accept: "jsFunction" }
    },
    bodyFunction: function(factoryRequest_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        var factoryRequest = factoryRequest_;
        while (!inBreakScope) {
            inBreakScope = true;

            var innerFactoryResponse = arccore.filter.create({
                operationID: factoryRequest.id,
                operationName: factoryRequest.name,
                operationDescription: factoryRequest.description,
                inputFilterSpec: {
                    ____label: "HTML Content Render Request",
                    ____types: "jsObject",
                    // We need the entire reactContext in bodyFunction scope but do not want to incur
                    // the runtime overhead of forcing ARCcore.discriminator to track all of its features;
                    // we're only interested in routing based on the actual document data.
                    reactContext: {
                        ____label: "React Context Data",
                        ____description: "A reference to the parent React component's full context data (this.props).",
                        ____accept: "jsObject" // NOT SCHEMATIZED BY DESIGN
                    },
                    documentData: factoryRequest.dataBindingSpec
                },
                bodyFunction: function(htmlContentRenderRequest_) {
                    // console.log("..... " + this.operationID + "::" + this.operationName);
                    // Update the document data with normalized values.
                    htmlContentRenderRequest_.reactContext.document.data = htmlContentRenderRequest_.documentData;
                    var htmlContent = React.createElement(factoryRequest.reactComponent, htmlContentRenderRequest_.reactContext);
                    return { error: null, result: htmlContent };
                },
                outputFilterSpec: {
                    ____label: "React Content Element",
                    ____description: "The instantiated React render component bound to the correct data context.",
                    ____accept: "jsObject"
                }
            });
            if (innerFactoryResponse.error) {
                errors.unshift(innerFactoryResponse.error);
                break;
            }
            response.result = innerFactoryResponse.result;
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
