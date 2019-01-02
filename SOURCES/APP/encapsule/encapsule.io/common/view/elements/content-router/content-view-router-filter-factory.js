// content-view-router-filter-factory.js

const arccore = require('arccore');
const contentViewDataBindingFilterFactory = require('./content-view-data-binding-filter-factory');
const contentViewDeclarationSpec = require('./iospecs/content-view-declaration-spec');

var factoryResponse = arccore.filter.create({
    operationID: "1glIOyf5SoaBRtkyNUYAsA",
    operationName: "Content View Router Filter Factory",
    operationDescription: "Constructs a discriminating data router used to dynamically dispatch an " +
        "HTML render request message to an appropriate React component that converts the message data " +
        "to an HTML-encoded UTF8 string.",
    inputFilterSpec: {
        ____label: "Content View Router Factory Request",
        ____description: "Request descriptor object containing input for the content view router filter factory.",
        ____types: "jsObject",
        contentViewDataBindings: {
            ____label: "Content View Data Bindings",
            ____description: "An array of data message specification to content view component binding descriptor objects.",
            ____types: "jsArray",
            contentViewDataBinding: contentViewDeclarationSpec,
        },
        seed: {
            ____label: "Seed Identifier",
            ____description: "A 22-character IRUT identifier used to generate sub-filter identifiers.",
            ____accept: "jsString"
        }
    },
    outputFilterSpec: {
        ____label: "Content View Router Filter Descriptor",
        ____accept: "jsObject" // for now...
    },
    bodyFunction: function(factoryRequest_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        var factoryRequest = factoryRequest_;
        while (!inBreakScope) {
            inBreakScope = true;

            var innerFactoryResponse;
            var contentViewDataBindingFilters = [];

            // Construct a content view data binding filter for each content view data binding declaration.
            for (var contentViewDataBinding of factoryRequest_.contentViewDataBindings) {
                contentViewDataBinding.id =
                    arccore.identifier.irut.fromReference(factoryRequest_.seed + "::" + contentViewDataBinding.name).result;
                var innerFactoryResponse = contentViewDataBindingFilterFactory.request(contentViewDataBinding);
                if (innerFactoryResponse.error) {
                    errors.unshift(innerFactoryResponse.error);
                    break;
                }
                contentViewDataBindingFilters.push(innerFactoryResponse.result);
            }
            if (errors.length)
                break;

            // Create an ARCcore.discriminator filter that routes its request to 1:N possible target filters.
            innerFactoryResponse = arccore.discriminator.create({
                options: { action: 'routeRequest' },
                filters: contentViewDataBindingFilters
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
