// common.js
//

const reactComponentBindingFilterFactory = require("./sources/common/view/component-router/react-component-binding-filter-factory");

module.exports = {
    factories: {
        view: {
            reactComponentBindingFilter: reactComponentBindingFilterFactory
        }
    }
};
