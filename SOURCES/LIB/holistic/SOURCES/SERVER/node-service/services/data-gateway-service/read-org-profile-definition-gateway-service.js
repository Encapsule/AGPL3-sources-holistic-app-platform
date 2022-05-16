// read-org-profile-definition-gateway-service.js

const holism = require("@encapsule/holism");

const { iospecs } = require("../../../../COMMON/rest-api");
const serviceCore = require("../../../../COMMON/service-core");
const appBuild = serviceCore.getAppBuild();

const datastore = require("../../../storage/google-datastore");
const entityKinds = require("../../../storage/data/constants").datastore.entities.kinds;
const { makeDatastoreKey } = require("./utils");

// This service will be made available only to members of the application's owning organization.
// i.e. external users will not be allowed to create, read, update, delete an organization profile.

const factoryResponse = holism.service.create({

    id: "qTPpEiNMTnG1XTCffdBLUw",
    name: "Read Org Profile Definition Gateway Service",
    description: "Returns a replicated copy of an organization profile definitions document.",

    constraints: {

        request: {

            content: { encoding: "utf8", type: "application/json" },
            query_spec: { ____types: "jsUndefined" },

            request_spec: iospecs.requests.readOrgProfileDefinition,

            options_spec: { ____types: "jsObject", ____defaultValue: {} }

        }, // #.request

        response: {

            content: { encoding: "utf8", type: "application/json" },

            result_spec: iospecs.results.readOrgProfileDefinition,

            error_context_spec: {
                ____opaque: true

            } // #.constraints.response.error_content_spec

        }, // #.constraints.response

    }, // #.constraints

    handlers: {
        request_handler: function(request_) {
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                let responseAttempt;

                let readOrgProfileResponse;
                try {
                    readOrgProfileResponse = new Promise(
                        (resolve_, reject_) => {
                            const appErrors = [];

                            try {
                                const orgID = request_.request_descriptor.session.organizationId;

                                let transaction = datastore.transaction();

                                transaction.run(
                                    (error_, transaction_) => {
                                        try {
                                            let key;
                                            const entityKeyRequest = makeDatastoreKey({kind: entityKinds.orgProfile, orgID});
                                            if(entityKeyRequest.error) {
                                                appErrors.push(entityKeyRequest.error);
                                                resolve_({ appErrors: { appErrors }});
                                                return;
                                            } else {
                                                key = entityKeyRequest.result;
                                            }

                                            transaction_.get(key).then(
                                                (queryResult_) => {
                                                    try {
                                                        if(!queryResult_[0]) {
                                                            appErrors.push({
                                                                errorCodeID: "aydZHTmCQaKjom379W2idw", // "Entity does not exist."
                                                                errorCodeSource: "5oGk6ollQxy8NUrSFh2EQg",
                                                                errorContext: {
                                                                    id: orgID
                                                                }
                                                            });

                                                            resolve_({ appErrors: { appErrors } });
                                                        } else {
                                                            const orgProfileEntity = queryResult_[0];
                                                            const pAxNjBfRR1OOsaEoloBhbQ_AppDefinitionReplica = {
                                                                replicaVersion: orgProfileEntity.version,
                                                                replicaVDID: orgProfileEntity.VDID,
                                                                definition: orgProfileEntity.definition
                                                            };
                                                            resolve_({ replicas: [ { pAxNjBfRR1OOsaEoloBhbQ_AppDefinitionReplica } ] });
                                                        }
                                                    } catch (queryResultProcessingError_) {
                                                        console.log(queryResultProcessingError_);
                                                        appErrors.push({
                                                            errorCodeID: "JSb4Jvh1TBeSPWpIwsHSqQ", // "Unexpected error while processing the query result."
                                                            errorCodeSource: "77V2OwkfREiTnqVJP_X1mg",
                                                            errorContext: {
                                                                errorMessage: queryResultProcessingError_.message
                                                            }
                                                        });

                                                        resolve_({ appErrors: { appErrors } });
                                                    }

                                                    try {
                                                        transaction_.rollback();
                                                    } catch(err) {
                                                        console.log(err);
                                                    }
                                                    return;
                                                }
                                            ).catch(
                                                (queryError_) => {
                                                    console.log(queryError_);
                                                    appErrors.push({
                                                        errorCodeID: "vsWLtzJFRlCEsEYAU8fwNw", // "Unexpected error during the query request."
                                                        errorCodeSource: "MDxnr-7fSz-nRFH3Zvt2gg",
                                                        errorContext: {
                                                            errorMessage: queryError_.message
                                                        }
                                                    });

                                                    try {
                                                        transaction_.rollback();
                                                    } catch(err) {
                                                        console.log(err);
                                                        appErrors.push({
                                                            errorCodeID: "uKupEQsgTqeKmY9R2dfFQw", // "Unable to rollback Datastore transaction."
                                                            errorCodeSource: "GRfN6t72TxmHyfKxggTfiQ",
                                                            errorContext: {
                                                                errorMessage: err.message
                                                            }
                                                        });
                                                    }

                                                    resolve_({ appErrors: { appErrors }
                                                    });
                                                    return;
                                                }
                                            );
                                        } catch(transactionRunError_) {
                                            console.log(transactionRunError_);
                                            appErrors.push({
                                                errorCodeID: "Qlvj1M4xQS6dXjBjYjzJMg", // "Unexpected error during the database transaction."
                                                errorCodeSource: "k_neJN4DQIOynw-QZ86vlQ",
                                                errorContext: {
                                                    errorMessage: transactionRunError_.message
                                                }
                                            });

                                            try {
                                                transaction_.rollback();
                                            } catch(err) {
                                                console.log(err);
                                                appErrors.push({
                                                    errorCodeID: "uKupEQsgTqeKmY9R2dfFQw", // "Unable to rollback Datastore transaction."
                                                    errorCodeSource: "C0hhGz0HR7mlyxel9SNTqQ",
                                                    errorContext: {
                                                        errorMessage: err.message
                                                    }
                                                });
                                            }

                                            resolve_({ appErrors: { appErrors } });
                                            return;
                                        }
                                    }
                                );
                            } catch(transactionError_) {
                                console.log(transactionError_);
                                appErrors.push({
                                    errorCodeID: "50SgDnYpRCGEZ3p93fxlsg", // "Unexpected error trying to instantiate the Datastore transaction."
                                    errorCodeSource: "H0aDJ-ZQSoaxQbXMOKM9QA",
                                    errorContext: {
                                        errorMessage: transactionError_.message
                                    }
                                });

                                resolve_({
                                    appErrors: {
                                        appErrors
                                    }
                                });
                                return;
                            }
                        }
                    );
                } catch(entityAccessorAttemptError_) {
                    console.log(entityAccessorAttemptError_);
                    errors.unshift("Failed to construct storage access promise.");
                    break;
                }

                readOrgProfileResponse.then( (readOrgProfileResult_) => {
                    responseAttempt = request_.response_filters.result.request({
                        ...request_,
                        response_descriptor: {
                            http: { code: 200, message: "Success" },
                            content: { encoding: "utf8", type: "application/json" },
                            data: {
                                serverVersion: {
                                    version: appBuild.app.version,
                                    buildID: appBuild.app.buildID
                                },
                                ...readOrgProfileResult_
                            }
                        }
                    });

                    if(responseAttempt.error) {
                        console.log(responseAttempt.error);
                        const errorAttempt = request_.response_filters.error.request({
                            streams: request_.streams,
                            integrations: request_.integrations,
                            request_descriptor: request_.request_descriptor,
                            error_descriptor: {
                                http: { code: 500 },
                                content: { encoding: "utf8", type: "application/json" },
                                data: {
                                    error_message: "Failed to write to the result response stream.",
                                    error_context: {
                                        source_tag: "XD1NFw8KTL-WbuT91vBj_g"
                                    }
                                }
                            }
                        });

                        if (errorAttempt.error) {
                            console.log(errorAttempt.error);
                            return { error: "Failed to write to the error response stream." };
                        }

                        return errorAttempt;
                    }

                    return responseAttempt;
                }).catch( err => {
                    console.log(err);
                    const errorAttempt = request_.response_filters.error.request({
                        streams: request_.streams,
                        integrations: request_.integrations,
                        request_descriptor: request_.request_descriptor,
                        error_descriptor: {
                            http: { code: 500 },
                            content: { encoding: "utf8", type: "application/json" },
                            data: {
                                error_message: "An error occured while trying to read to the database entity.",
                                error_context: {
                                    source_tag: "fxX7tkCqRAKffnAqtgCNHw"
                                }
                            }
                        }
                    });

                    if (errorAttempt.error) {
                        console.log(errorAttempt.error);
                        return { error: "Failed to write to the error response stream." };
                    }

                    return errorAttempt;
                });
            }

            if (errors.length) {
                const message = errors.join(" ");
                console.log("Errors!", message);
                let errorAttempt = request_.response_filters.error.request({
                    streams: request_.streams,
                    integrations: request_.integrations,
                    request_descriptor: request_.request_descriptor,
                    error_descriptor: {
                        http: { code: 500 },
                        content: { encoding: "utf8", type: "application/json" },
                        data: {
                            error_message: message,
                            error_context: {
                                source_tag: "2353jDzUQGaqJuY29t5WRQ"
                            }
                        }
                    }
                });
                if (errorAttempt.error) {
                    console.log(errorAttempt.error);
                    return { error: "Failed to write to the error response stream." };
                }
            }
            return { error: null, result: null };
        } // request_handler
    }


});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
