// read-org-resource-deifnitions-gateway-service.js


const holism = require("@encapsule/holism");

const { iospecs } = require("../../../../COMMON/rest-api");
const serviceCore = require("../../../../COMMON/service-core");
const appBuild = serviceCore.getAppBuild();

const datastore = require("../../../storage/google-datastore");
const entityKinds = require("../../../storage/data/constants").datastore.entities.kinds;
const { makeDatastoreKey, calcOrgResourceId } = require("./utils");

// This service will be made available only to members of the Viewpath organization.
// i.e. external users will not be allowed to create, read, update, delete an organization profile.

const factoryResponse = holism.service.create({

    id: "yPyU207hRXWONL-Qcx46bw",
    name: "Read Org Resource Definitions Gateway Service",
    description: "Returns a replicated copy of the user's organization resource definitions document.",

    constraints: {

        request: {

            content: { encoding: "utf8", type: "application/json" },
            query_spec: { ____types: "jsUndefined" },

            request_spec: iospecs.requests.readOrgResourceDefinitions,

            options_spec: { ____types: "jsObject",____defaultValue: {} }

        }, // #.request

        response: {

            content: { encoding: "utf8", type: "application/json" },

            result_spec: iospecs.results.readOrgResourceDefinitions,

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

                let readOrgResourceResponse;
                try {
                    readOrgResourceResponse = new Promise(
                        (resolve_, reject_) => {
                            const appErrors = [];

                            try {
                                const orgID = request_.request_descriptor.session.organizationId;
                                const entityID = calcOrgResourceId(orgID);
                                let transaction = datastore.transaction();

                                transaction.run(
                                    (error_, transaction_) => {
                                        try {
                                            let key;
                                            const entityKeyRequest = makeDatastoreKey({kind: entityKinds.orgResource, entityID, orgID});
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
                                                                errorCodeSource: "Mm5Stf0DTji6oFwiyWEfSg",
                                                                errorContext: {
                                                                    id: entityID
                                                                }
                                                            });

                                                            resolve_({ appErrors: { appErrors } });
                                                        } else {
                                                            const entity = queryResult_[0];
                                                            const pAxNjBfRR1OOsaEoloBhbQ_AppDefinitionReplica = {
                                                                replicaVersion: entity.version,
                                                                replicaVDID: entity.VDID,
                                                                definition: entity.definition
                                                            };
                                                            resolve_({ replicas: [ { pAxNjBfRR1OOsaEoloBhbQ_AppDefinitionReplica } ] });
                                                        }
                                                    } catch (queryResultProcessingError_) {
                                                        console.log(queryResultProcessingError_);
                                                        appErrors.push({
                                                            errorCodeID: "JSb4Jvh1TBeSPWpIwsHSqQ", // "Unexpected error while processing the query result."
                                                            errorCodeSource: "MaFVwtxVSxCWbP2Oet81Cg",
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
                                                        errorCodeSource: "zP1fXRW-QOOCBvLv3kYpkQ",
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
                                                            errorCodeSource: "84NnPAE2QyuWNaWE96zEbA",
                                                            errorContext: {
                                                                errorMessage: err.message
                                                            }
                                                        });
                                                    }

                                                    resolve_({ appErrors: { appErrors } });
                                                    return;
                                                }
                                            );
                                        } catch(transactionRunError_) {
                                            console.log(transactionRunError_);
                                            appErrors.push({
                                                errorCodeID: "Qlvj1M4xQS6dXjBjYjzJMg", // "Unexpected error during the database transaction."
                                                errorCodeSource: "J2BcQ6BjQjGfiNpQIxXF5g",
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
                                                    errorCodeSource: "XkP78fxcRMSIq-XrYOisXg",
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
                                    errorCodeSource: "cFWxLgMQQl22T5xGaCXwXA",
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

                readOrgResourceResponse.then( (readOrgResourceResult_) => {
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
                                ...readOrgResourceResult_
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
                                        source_tag: "-92VXRwuR6asB_4YvSKcpw"
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
                                    source_tag: "id4R5NeISuiXJAp2wdg34Q"
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
                                source_tag: "Tu4UQUuBT8SK8khWR3-5oA"
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
