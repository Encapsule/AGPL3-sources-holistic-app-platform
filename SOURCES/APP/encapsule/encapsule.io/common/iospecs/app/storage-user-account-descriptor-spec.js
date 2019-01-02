// storage-user-account-descriptor-spec.js
//
// Defines the format of a user account descriptor object
// persisted by server's backend storage subsystem.

const arccore = require('arccore');

const clientUserCreateRequestSpec = require('./client-user-account-create-request-spec');

var spec = arccore.util.clone(clientUserCreateRequestSpec);

// Remove all the ____appdsl metadata from the client user create request spec.
// These are only needed in cases where derived processing code requires addition
// context (e.g. like rendering a form based on data specification).
for (var key in spec) {
    if (key.startsWith('____')) {
        // Skip filter specification directives.
        continue;
    }
    delete spec[key].____appdsl;
}

// Relabel the root namespace.
spec.____label = "Storage User Account Descriptor";
spec.____description = "User account descriptor persistence format.";

// Add username SHA256 property
spec.username_sha256 = {
    ____label: "Username Hash",
    ____description: "A SHA256 digest hash of the user's username.",
    ____accept: "jsString"
};

// Add password SHA256 property.
spec.password_sha256 = {
    ____label: "User Password Hash",
    ____description: "A SHA256 digest hash of the user's password.",
    ____accept: "jsString"
};

// Delete plaintext password and password confirmation.
delete spec.password1;
delete spec.password2;

module.exports = spec;

// console.log(JSON.stringify(spec, undefined, 4));

