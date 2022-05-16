// read-org-project-definitions-gateway-service.js

const holism = require("@encapsule/holism");

const { iospecs } = require("../../../../COMMON/rest-api");
const serviceCore = require("../../../../COMMON/service-core");
const appBuild = serviceCore.getAppBuild();

const datastore = require("../../../storage/google-datastore");
const entityKinds = require("../../../storage/data/constants").datastore.entities.kinds;
const { makeDatastoreKey } = require("./utils");

// This service will be made available only to members of the app's owning organization.
// i.e. external users will not be allowed to create, read, update, delete an organization profile.

const factoryResponse = holism.service.create({

    id: "2JRzT-dBRUi0SPr_UPizrA",
    name: "Read Org Project Definitions Gateway Service",
    description: "Returns replicated copy(ies) of project definition(s) created by members of the requesting user's organization.",

    constraints: {

        request: {

            content: { encoding: "utf8", type: "application/json" },
            query_spec: { ____types: "jsUndefined" },

            request_spec: iospecs.requests.readOrgProjectDefinitions,

            options_spec: { ____types: "jsObject", ____defaultValue: {} }

        }, // #.request

        response: {

            content: { encoding: "utf8", type: "application/json" },

            result_spec: iospecs.results.readOrgProjectDefinitions,

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

                const message = request_.request_descriptor.data.body;
                let responseAttempt;

                // Quick check to immediately return if no IDs supplied.
                if(message.readOrgProjectDefinitions.projects.length === 0) {
                    responseAttempt = request_.response_filters.result.request({
                        ...request_,
                        response_descriptor: {
                            http: { code: 200, message: "Success" },
                            content: { encoding: "utf8", type: "application/json" },
                            data: {
                                serverVersion: {
                                    version: appBuild.app.version,
                                    buildID: appBuild.app.buildID
                                }
                            }
                        }
                    });

                    if (responseAttempt.error) {
                        console.log(responseAttempt.error);
                        errors.push("Failed to write to the response stream.");
                        break;
                    }

                    return { result: null, error: null };
                }

                // Deduplicate projectIDs so we can check for an expected number of responses from the query.
                const projectIDs = [ ...new Set(message.readOrgProjectDefinitions.projects) ];

                let readOrgProjectsResponse;
                try {
                    readOrgProjectsResponse = new Promise(
                        (resolve_, reject_) => {
                            const appErrors = [];

                            try {
                                const orgID = request_.request_descriptor.session.organizationId;
                                let transaction = datastore.transaction();

                                transaction.run(
                                    (error_, transaction_) => {
                                        try {
                                            const keys = [];
                                            projectIDs.forEach( projectID => {
                                                const entityKeyRequest = makeDatastoreKey({kind: entityKinds.project, entityID: projectID, orgID});
                                                if(entityKeyRequest.error) {
                                                    appErrors.push(entityKeyRequest.error);
                                                    return;
                                                } else {
                                                    keys.push(entityKeyRequest.result);
                                                }
                                            });

                                            transaction_.get(keys).then(
                                                (queryResult_) => {
                                                    try {
                                                        if(projectIDs.length !== queryResult_[0].length) {
                                                            const queryResultIDs = queryResult_[0].map( projectEntity => projectEntity.id);
                                                            projectIDs.forEach( projectID => {
                                                                if(!queryResultIDs.includes(projectID)) {
                                                                    appErrors.push({
                                                                        errorCodeID: "aydZHTmCQaKjom379W2idw", // "Entity does not exist."
                                                                        errorCodeSource: "RXsfjr8mR4yVM5NQhS44Pw",
                                                                        errorContext: {
                                                                            id: projectID
                                                                        }
                                                                    });
                                                                }
                                                            });

                                                            resolve_({ appErrors: { appErrors } });
                                                        } else {
                                                            const projects = queryResult_[0].map( project => ({
                                                                "pAxNjBfRR1OOsaEoloBhbQ_AppDefinitionReplica": {
                                                                    replicaVersion: project.version,
                                                                    replicaVDID: project.VDID,
                                                                    definition: project.definition
                                                                }
                                                            }));
                                                            resolve_({ replicas: projects });
                                                        }
                                                    } catch (queryResultProcessingError_) {
                                                        console.log(queryResultProcessingError_);
                                                        appErrors.push({
                                                            errorCodeID: "JSb4Jvh1TBeSPWpIwsHSqQ", // "Unexpected error while processing the query result."
                                                            errorCodeSource: "L1lsCrNWT6ulCrxQZybdCA",
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
                                                        errorCodeSource: "ZRJwR0etQXGHpmiglTul2Q",
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
                                                            errorCodeSource: "2bwbnupFRWKSrvSLxhP5tw",
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
                                                errorCodeSource: "cQTq8ZgvT9G9zuv-233xDg",
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
                                                    errorCodeSource: "hKyOf2-nQRGC_k4qO6xJ8Q",
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
                                    errorCodeSource: "7-pQ4oSdRsK7keHvNJqlJg",
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

                readOrgProjectsResponse.then( (readOrgProjectsResult_) => {
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
                                ...readOrgProjectsResult_
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
                                        source_tag: "IBisdl4WQxyW9sti6DsHMQ"
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
                                    source_tag: "jYJcGEBZSKqj7N9R4QkT1Q"
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
                                source_tag: "dBA5C6dnRfmreUFeqA58bQ"
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
