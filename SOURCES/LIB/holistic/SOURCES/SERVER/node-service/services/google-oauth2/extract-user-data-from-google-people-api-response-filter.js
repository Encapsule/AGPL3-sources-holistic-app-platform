
const arccore = require("@encapsule/arccore");
const googlePeopleQueryResponseSpec = require("./google-people-query-response-spec");
const googlePeopleProfileDataSpec = require("./google-people-profile-data-spec");

const factoryResponse = arccore.filter.create({
    operationID: "SdidCrYiSwqgUJ2K2ekpkw",
    operationName: "Google User Data Extractor",
    operationDescription: "Extracts Google user profile data from reponse JSON obtained by calling the Google People API with a previously-obtained OAuth2 token.",

    inputFilterSpec: googlePeopleQueryResponseSpec,
    outputFilterSpec: googlePeopleProfileDataSpec,

    bodyFunction: function(request_) {
        let response = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            let selectedName = null;
            let selectedEmail = null;
            let selectedPhoto = null;

            while (request_.data.names.length) {
                let nameDescriptor = request_.data.names.shift();
                if (nameDescriptor.metadata.primary) {
                    selectedName = nameDescriptor;
                    break;
                }
            }
            if (!selectedName) {
                errors.push("Unable to locate the primary name record in user profile data.");
                break;
            }

            while (request_.data.emailAddresses.length) {
                let emailDescriptor = request_.data.emailAddresses.shift();
                if (emailDescriptor.metadata.primary) {
                    selectedEmail = emailDescriptor;
                    break;
                }
            }
            if (!selectedEmail) {
                errors.push("Unable to locate the primary email record in user profile data.");
                break;
            }

            while (request_.data.photos.length) {
                let photoDescriptor = request_.data.photos.shift();
                if (photoDescriptor.metadata.primary) {
                    selectedPhoto = photoDescriptor;
                    break;
                }
            }
            if (!selectedPhoto) {
                errors.push("Unable to locate the primary avatar image in user profile data.");
                break;
            }

            response.result = {
                profileUri: request_.data.resourceName,
                givenName: selectedName.givenName,
                familyName: selectedName.familyName,
                emailAddress: selectedEmail.value,
                photoUrl: selectedPhoto.url
            };

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;

    } // bodyFunction

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
