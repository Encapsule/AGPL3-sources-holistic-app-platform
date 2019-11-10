// chai-assert-fascade.js
//

const chai = require("chai");
const assert = chai.assert;

// TODO: Follow-up with chai team and see if this is really anything more than an unsafe hack.

const assertFascade = { ...assert }; // copy the original
const assertFuncs = Object.keys(assert);

while (assertFuncs.length) {
    const funcName = assertFuncs.shift();
    // Replace all functions (seemingly unbound) on the assert namesapce descriptor with fascades.
    if (Object.prototype.toString.call(assert[funcName]) === "[object Function]") {
        const originalFunction = assert[funcName];
        assertFascade[funcName] = function() {
            let args = [].slice.call(arguments, 0);
            let response = { error: null, result: args };
            try {
                originalFunction(args);
            } catch (exception_) {
                response.error = exception_;
            }
            return response;
        };
    }
};

module.exports = assertFascade;





