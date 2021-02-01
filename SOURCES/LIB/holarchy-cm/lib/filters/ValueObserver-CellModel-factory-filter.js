// ValueObserver-CellModel-factory-filter.js

const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");

(function() {

    const filterDeclaration  = {
        operationID: "subr4UgeSl27Z-rzp2ryog",
        operationName: "ValueObserver CellModel Factory",
        operationDescription: "A filter that manufactures a ValueObserver CellModel class instance that is specialized to a specific value type.",

        inputFilterSpec: {
            ____label: "ValueObserver CellModel Factory Request",
            ____description: "Descriptor object sent to ValueObserver CellModel factory with instructions about how to specialize the desired CellModel instance.",
            ____types: "jsObject",
            cellID: { ____accept: "jsString" }, // must be a unique IRUT
            apmID: { ____accept: "jsString" }, // must be a unique IRUT
            valueTypeLabel: { ____accept: "jsString" },
            valueTypeDescription: { ____accept: "jsString" },
            valueTypeSpec: {
                ____label: "Value Data Specification",
                ____description: "An @encapsule/arccore.filter specification for the value type to be made observable.",
                ____accept: "jsObject" // This is an @encapsule/arccore.filter specification declaration.
            }
        },

        outputFilterSpec: {
            ____accept: "jsObject" // This is an @encapsule/holarchy CellModel class instance.
        },

        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                let innerResponse = arccore.identifier.irut.isIRUT(request_.cellID);
                if (!innerResponse.result) {
                    errors.push(`Invalid cellID value "${request_.cellID}": ${innerResponse.guidance}`);
                    break;
                }

                innerResponse = arccore.identifier.irut.isIRUT(request_.apmID);
                if (!innerResponse.result) {
                    errors.push(`Invalid apmID value "${request_.apmID}": ${innerResponse.guidance}`);
                    break;
                }

                const cellModelDeclaration = {
                    id: request_.cellID,
                    name: `${request_.valueTypeLabel} ValueObserver Model`,
                    description: `ValueObserver specialization for value type "${request_.valueTypeLabel}".`,
                    apm: {
                        id: request_.apmID,
                        name: `${request_.valueTypeLabel} ValueObserver AbstractProcessModel`,
                        description: `ValueObserver specialization for type "${request_.valueTypeLabel}". Value description "${request_.valueTypeDescription}"`,
                    },
                    actions: [
                    ],
                    operators: [
                    ],
                    subcells: [
                    ]
                };

                const cellModel = new holarchy.CellModel(cellModelDeclaration);
                if (!cellModel.isValid()) {
                    errors.push(cellModel.toJSON());
                    break;
                }

                response.result = cellModel;

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    };

    const factoryResponse = arccore.filter.create(filterDeclaration);
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result;

})();

