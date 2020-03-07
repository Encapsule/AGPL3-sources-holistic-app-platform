// hr-method-constructor-filter-input-spec.js

module.exports = {

    ____label: "Holodeck Runner Constructor Filter Input Spec",
    ____types: "jsObject",


    id: {
        ____label: "Holodeck Runner ID",
        ____description: "A unique IRUT ID to be used as the holodeck runner's ID.",
        ____accept: "jsString",
    },

    name: {
        ____label: "Holodeck Runner Name",
        ____description: "A short human-readable name to be given to this holodeck runner.",
        ____accept: "jsString"
    },

    description: {
        ____label: "Holodeck Runner Description",
        ____description: "A short description of the function and purpose of this specific holodeck runner.",
        ____accept: "jsString"
    },

    testHarnessFilters: {
        ____label: "Holodeck Test Harness Filters",
        ____description: "An array of previously-constructed holodeck test harness filters to be used to construct the holodeck runner filter's MDR-pattern dispatcher.",
        ____types: "jsArray",
        ____defaultValue: [],
        testHarnessFilter: { ____accept: "jsObject" } // test harness filter instance reference
    }

};
