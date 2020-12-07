// HolisticAppNucleus-method-constructor-filter-output-spec.js

module.exports = {
    ____label: "HolisticAppCommon Private Instance Data",
    ____types: "jsObject",

    nonvolatile: {
        ____label: "Holistic Service Core NVRAM",
        ____description: "Data in this namespace is considered nonvolatile (i.e. read-only/immutable) for the during of a holistic app service's runtime.",
        ____types: "jsObject",

        // A note about terminology.
        // In C++ a declaration tells the compiler "Hey - there's this thing called X and it has a type of Y."
        // And, a definition is a statement that tells the compiler "Hey - I want an instance of Y named Z to use in my algorithm."
        // Here we define the format of serviceCoreDefinition which reads "We want an instance of Y (where Y is a "Holistic Service Core Definition" type as per the spec)
        // called Z (where Z is a "variable" (modeled as a namespace in a document) named "serviceCoreDefinition").
        // Not to confuse matters more...
        // A "service core defition" is a collection of other "definitions" some of which are actually "declarations" as per the definitions above.
        // Mostly, nobody should care. But, if you are readying through this code and trying to understand it then this information will help you
        // keep your bearing.

        serviceCoreDefinition: {
            ...require("./HolisticAppCommon-method-constructor-filter-input-spec"), // This is the constructor filter's input spec that we spread into the output spec and relabel.
            ____label: "Holistic Service Core Definition",
            ____description: "This is a frozen copy of the constructor request descriptor object that we keep for reference so that it is possible to deeply introspect a derived app service runtime."
        }

    }
};


