// chai-assert-fascade.js
//

const chai = require("chai");

// It will take additional effort to determine how to deal and if it's worth dealing
// with chai's expect/should features that present a much more complex integration
// than their assert API's due to function chaining syntax and some or another protocol
// that has to be reverse engineered from sources it looks like. SO, for now we'll just
// leverage chai's assert functions slightly modified so that they do not throw ErrorAssertions
// that are inconvenient for our style of testing w/holodeck.

const assert = chai.assert; // https://www.chaijs.com/api/assert/

const assertFascade = { ...assert }; // copy the original
const assertFuncs = Object.keys(assert);

while (assertFuncs.length) {
    const funcName = assertFuncs.shift();
    // Replace all functions (seemingly unbound) on the assert namespace descriptor with fascades.
    if (Object.prototype.toString.call(assert[funcName]) === "[object Function]") {
        const originalFunction = assert[funcName];
        assertFascade[funcName] = function() {
            let args = [].slice.call(arguments, 0);
            let didAssert = false;
            let response = { funcName, args, assertion: null }; // <--- THIS IS WHAT YOU GET BACK from the fascade wrapper around each chai.assert.X function _instead_ of an exception ErrorAssertion
            try {
                // It's an assertion library ;-) It throws ErrorAssertions to indicate the assertion is not met.
                originalFunction(...args);
            } catch(exception_) {
                response.assertion = exception_.message; // Is an ErrorAssertion object
            }
            return response;
        };
    }
};

module.exports = assertFascade;





