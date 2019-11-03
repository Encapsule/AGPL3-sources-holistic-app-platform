
const arccore = require("@encapsule/arccore");

var factoryResponse = arccore.filter.create({
    operationID: "actXQlKYQ9KDriZba3t00w",
    operationName: "Controller Action Filter Factory",
    operationDescription: "Constructs a controller action filter plug-in compatible with ObservableProcessModel and ObversableProcessController.",
    inputFilterSpec: {
        ____label: "Filter Factory Request",
        ____types: "jsObject",
        id: { ____accept: "jsString" },
        name: { ____accept: "jsString" },
        description: { ____accept: "jsString" },
        actionRequestSpec: { ____accept: "jsObject" },
        bodyFunction: { ____accept: "jsFunction" }
    },
    bodyFunction: function(request_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            var innerFactoryResponse = arccore.filter.create({
                operationID: request_.id,
                operationName: request_.name,
                operationDescription: request_.description,
                inputFilterSpec: {
                    ____label: request_.name + " Request",
                    ____types: "jsObject",
                    context: {
                        ____label: "OPC Context Descriptor",
                        ____description: "An object containing references to OPC instance-managed runtime API's available to transition operator filters.",
                        ____types: "jsObject",
                        dataPath: {
                            ____label: "OPM Binding Namespace",
                            ____description: "Dot-delimited path to the current OPM instance's associated data in the OPD.",
                            ____accept: "jsString"
                        },
                        ocdi: {
                            ____label: "OCD Store Instance",
                            ____description: "A reference to the OCD store instance managed by OPC.",
                            ____accept: "jsObject"

                        },
                        act: {
                            ____label: "OPC Action Request Dispatcher",
                            ____description: "A reference to ObservableProcessController.act method.",
                            ____accept: "jsFunction"
                        }
                    },
                    actionRequest: request_.actionRequestSpec
                },
                outputFilterSpec: { ____accept: "jsBoolean" },
                bodyFunction: request_.bodyFunction,

            });
            if (innerFactoryResponse.error) {
                errors.unshift(innerFactoryResponse.error);
                break;
            }
            response.result = innerFactoryResponse.result;
            break;
        }
        if (errors.length)
            response.error = errors.join(" ");
        return response;
    },
    outputFilterSpec: {
        ____label: "Controller Action Filter",
        ____accept: "jsObject"
    }
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
