// app-metadata-user-session-spec.js

const holistic = require('holistic');
const holisticPackageLabel = holistic.__meta.name + " v" + holistic.__meta.version;

/*

const developerInputUserSessionSpec = require('./developer-input-metadata-user-session-spec');

module.exports = developerInputUserSessionSpec;

*/

const arccore = require('arccore');

const storageUserAccountDescriptorSpec = require('./storage-user-account-descriptor-spec');
const userIdentityDescriptorSpec = require('./app-metadata-user-identity-spec');

var spec = arccore.util.clone(storageUserAccountDescriptorSpec);

// Relabel the root namespace.
spec.____label = "User Profile";
spec.____description = "User profile data returned by the application server to the view subsystem for rendering as HTML in various capacities.";

// Knock confidential information from the persisted user account descriptor out of the filter spec.
// This has the effect of clipping these values from the output of a filter if they're present in the input.
delete spec.username_sha256;
delete spec.password_sha256;

// Establish default user profile values for anonymous users.
spec.____defaultValue = {};
spec.username.____defaultValue = "anonymous@inter.net";
spec.firstName.____defaultValue = "Anonymous";
spec.lastName.____defaultValue = "User";
spec.email.____defaultValue =  spec.username.____defaultValue;

module.exports = spec;

