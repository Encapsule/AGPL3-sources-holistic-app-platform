// read-org-summary-report-gateway-service.js

const holism = require("@encapsule/holism");

const { iospecs } = require("../../../../COMMON/rest-api");
const serviceCore = require("../../../../COMMON/service-core");
const appBuild = serviceCore.getAppBuild();

const datastore = require("../../../storage/google-datastore");
const entityKinds = require("../../../storage/data/constants").datastore.entities.kinds;
const { makeDatastoreKey, calcOrgProfileMembersMapId } = require("./utils");

const factoryResponse = holism.service.create({

    id: "ACV_TQX2SjmcaQ5JQafDgg",
    name: "Read Org Summary Report Gateway Service",
    description: "Returns a summary of the user's organization including membership and organization member metadata.",

    constraints: {

        request: {

            content: { encoding: "utf8", type: "application/json" },
            query_spec: { ____types: "jsUndefined" },

            request_spec: iospecs.requests.readOrgSummaryReport,

            options_spec: { ____types: "jsObject", ____defaultValue: {} }

        }, // #.request

        response: {

            content: { encoding: "utf8", type: "application/json" },

            result_spec: iospecs.results.readOrgSummaryReport,

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
                let getOrgSummaryReportResponse;
                const appErrors = [];

                try {
                    const orgID = request_.request_descriptor.session.organizationId;

                    getOrgSummaryReportResponse = new Promise(
                        (resolve_, reject_) => {
                            try {
                                let transaction = datastore.transaction();

                                transaction.run(
                                    (error_, transaction_) => {
                                        // Generate key for OrgProfile and OrgProfileUserMap
                                        let keys = [];
                                        let entityKeyRequest = makeDatastoreKey({kind: entityKinds.orgProfile, orgID});
                                        if(entityKeyRequest.error) {
                                            appErrors.push(entityKeyRequest.error);
                                            resolve_({ appErrors: { appErrors } });
                                            return;
                                        } else {
                                            keys.push(entityKeyRequest.result);
                                        }

                                        const entityID = calcOrgProfileMembersMapId(orgID);
                                        entityKeyRequest = makeDatastoreKey({kind: entityKinds.orgProfileMembersMap, entityID, orgID});
                                        if(entityKeyRequest.error) {
                                            appErrors.push(entityKeyRequest.error);
                                            resolve_({ appErrors: { appErrors } });
                                            return;
                                        } else {
                                            keys.push(entityKeyRequest.result);
                                        }

                                        transaction_.get(keys)
                                            .then( queryResult_ => {
                                                try {
                                                    const queryResults = queryResult_[0];

                                                    let orgProfile, orgProfileMembersMap;
                                                    queryResults.forEach( entity => {
                                                        if(entity.definition["R6DTqieiQ8Wr5wo9tI0lJA_OrgProfile"]) {
                                                            orgProfile = entity.definition["R6DTqieiQ8Wr5wo9tI0lJA_OrgProfile"];
                                                        }
                                                        if(entity.definition["IBHNBO8tTFWClypVtn3kaA_OrgProfileMembersMap"]) {
                                                            orgProfileMembersMap = entity.definition["IBHNBO8tTFWClypVtn3kaA_OrgProfileMembersMap"];
                                                        }
                                                    });

                                                    if(queryResults.length !== 2) {
                                                        appErrors.push({
                                                            errorCodeID: "aydZHTmCQaKjom379W2idw", // "Entity does not exist."
                                                            errorCodeSource: "KkcspXOwToeHmYlw_30suw",
                                                            errorContext: {
                                                                id: orgProfile ? entityID : orgID
                                                            }
                                                        });

                                                        resolve_({ appErrors: { appErrors } });
                                                        return;
                                                    } else {
                                                        const report = {
                                                            name: orgProfile.name,
                                                            description: orgProfile.description || "",
                                                            memberIds: [],
                                                            memberEmails: orgProfile.members,
                                                            memberSummaries: {}
                                                        };

                                                        // Make User Profile keys
                                                        const keys = [];
                                                        Object.values(orgProfileMembersMap.membersMap).forEach( userId => {
                                                            keys.push(datastore.key([entityKinds.userProfile, userId]));
                                                        });

                                                        try {
                                                            transaction_.get(keys).then(
                                                                (queryResult_) => {
                                                                    try {
                                                                        const queryResults = queryResult_[0];
                                                                        queryResults.forEach( userProfileEntity => {
                                                                            const { appUserId, userEmailAddress, userGivenName, userFamilyName, userPhotoUrl } = userProfileEntity;
                                                                            report.memberIds.push(appUserId);
                                                                            report.memberSummaries[appUserId] = {
                                                                                appUserId,
                                                                                userEmailAddress,
                                                                                userGivenName,
                                                                                userFamilyName,
                                                                                userPhotoUrl
                                                                            };
                                                                        });

                                                                        resolve_({ report });
                                                                    } catch (queryResultProcessingError_) {
                                                                        console.log(queryResultProcessingError_);
                                                                        appErrors.push({
                                                                            errorCodeID: "JSb4Jvh1TBeSPWpIwsHSqQ", // "Unexpected error while processing the query result."
                                                                            errorCodeSource: "cPtaIAaAQIySWXUpAdtNiQ",
                                                                            errorContext: {
                                                                                errorMessage: queryResultProcessingError_.message
                                                                            }
                                                                        });

                                                                        resolve_({ appErrors: { appErrors } });
                                                                    }
                                                                }
                                                            ).catch(
                                                                (queryError_) => {
                                                                    console.log(queryError_);
                                                                    appErrors.push({
                                                                        errorCodeID: "vsWLtzJFRlCEsEYAU8fwNw", // "Unexpected error during the query request."
                                                                        errorCodeSource: "J2s1AO52T26BDhIpFmOAbw",
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
                                                                            errorCodeSource: "hmttWi4FQ3SMZzSnwUCAhg",
                                                                            errorContext: {
                                                                                errorMessage: err.message
                                                                            }
                                                                        });
                                                                    }

                                                                    resolve_({ appErrors: { appErrors } });
                                                                    return;
                                                                }
                                                            );
                                                        } catch( queryError_ ) {
                                                            console.log(queryError_);
                                                            appErrors.push({
                                                                errorCodeID: "vsWLtzJFRlCEsEYAU8fwNw", // "Unexpected error during the query request.",
                                                                errorCodeSource: "hJEuAsS7QuGOUS6hF5aQvw",
                                                                errorContext: {
                                                                    errorMessage: queryError_.message
                                                                }
                                                            });
                                                            resolve_({ appErrors: { appErrors } });
                                                            return;
                                                        }
                                                    }
                                                } catch (queryResultProcessingError_) {
                                                    console.log(queryResultProcessingError_);
                                                    appErrors.push({
                                                        errorCodeID: "JSb4Jvh1TBeSPWpIwsHSqQ", // "Unexpected error while processing the query result."
                                                        errorCodeSource: "GTMmYcatQlWOB08dvFkG6w",
                                                        errorContext: {
                                                            errorMessage: queryResultProcessingError_.message
                                                        }
                                                    });

                                                    resolve_({ appErrors: { appErrors } });
                                                    return;
                                                }
                                            }).catch( queryError_ => {
                                                console.log(queryError_);
                                                appErrors.push({
                                                    errorCodeID: "vsWLtzJFRlCEsEYAU8fwNw", // "Unexpected error during the query request.",
                                                    errorCodeSource: "lq782eORT7idVmG1z6zwEg",
                                                    errorContext: {
                                                        errorMessage: queryError_.message
                                                    }
                                                });
                                                resolve_({ appErrors: { appErrors } });
                                                return;
                                            });
                                    }
                                );
                            } catch(transactionError_) {
                                console.log(transactionError_);
                                appErrors.push({
                                    errorCodeID: "50SgDnYpRCGEZ3p93fxlsg", // "Unexpected error trying to instantiate the Datastore transaction."
                                    errorCodeSource: "OVCGwNfUR0Suxdjb5Wggaw",
                                    errorContext: {
                                        errorMessage: transactionError_.message
                                    }
                                });

                                resolve_({ appErrors: { appErrors } });
                                return;
                            }
                        }
                    );
                } catch(entityAccessAttemptError_) {
                    console.log(entityAccessAttemptError_);
                    errors.unshift("Failed to construct storage access promise.");
                    break;
                }

                getOrgSummaryReportResponse.then( (getOrgSummaryReportResult_) => {
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
                                ...getOrgSummaryReportResult_
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
                                        source_tag: "LQOLM1McRCilmKg283NU1A"
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
                                    source_tag: "kTOavt6pSyieURXnUfjlGg"
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
                                source_tag: "k1mk_INtRJGs4swA1O19HQ"
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
