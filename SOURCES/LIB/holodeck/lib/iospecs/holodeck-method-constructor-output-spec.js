// holodeck-method-constructor-output-spec.js

const inputFilterSpec = { ... require("./holodeck-method-constructor-input-spec") };
delete inputFilterSpec.holodeckHarnesses;

module.exports = {
    ...inputFilterSpec,
    ____label: "Holodeck Constructor Result",
    harnessDiscriminator: {
        ____label: "Holodeck Harness Discriminator",
        ____description: "A reference to a Holodeck environment's harness discriminator filter (used to route a harness request to a specific harness plug-in filter for evaluation.",
        ____types: "jsObject",
        filterDescriptor: { ____accept: "jsObject" },
        request: { ____accept: "jsFunction" },
        supportedFilters: { ____types: "jsArray", filterName: { ____accept: "jsString" } }
    },
    harnessFilters: {
        ____label: "Holodeck Harness Filters",
        ____description: "A sorted array of HolodeckHarness filters registered for use in this Holodeck instance. This includes both holodeck-intrinsic and developer-registered harnesses.",
        ____types: "jsArray",
        harnessFilter: {
            ____label: "Holodeck Harness Filter",
            ____description: "A filter object obtained from a registered HolodeckHarness instance.",
            ____types: "jsObject",
            filterDescriptor: { ____accept: "jsObject" },
            request: { ____accept: "jsFunction" }
        }
    }


};
