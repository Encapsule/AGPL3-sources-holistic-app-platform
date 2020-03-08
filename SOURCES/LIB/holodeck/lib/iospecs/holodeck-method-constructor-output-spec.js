// holodeck-method-constructor-output-spec.js

const inputFilterSpec = { ... require("./holodeck-method-constructor-input-spec") };
delete inputFilterSpec.holodeckHarnesses;

module.exports = {
    ...inputFilterSpec,
    ____label: "Holodeck Constructor Result",
    holodeckHarnessDispatcher: {
        ____label: "Holodeck Harness Dispatcher",
        ____types: "jsObject",
        filterDescriptor: { ____accept: "jsObject" },
        request: { ____accept: "jsFunction" },
        supportedFilters: { ____types: "jsArray", filterName: { ____accept: "jsString" } }
    }
};
