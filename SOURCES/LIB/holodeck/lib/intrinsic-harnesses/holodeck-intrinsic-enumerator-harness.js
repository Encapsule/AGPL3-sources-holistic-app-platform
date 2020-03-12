// holodeck-intrinsic-enumerator-harness.js

const HolodeckHarness = require("../../HolodeckHarness");

const enumeratorHarness = new HolodeckHarness({ createEnumeratorHarness: true });

if (enumeratorHarness.isValid()) {
    throw new Error(enumeratorHarness.toJSON());
}

module.exports = enumeratorHarness;
