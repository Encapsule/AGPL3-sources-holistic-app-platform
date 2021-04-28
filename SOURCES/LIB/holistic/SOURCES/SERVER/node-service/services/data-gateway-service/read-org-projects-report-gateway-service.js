// read-org-projects-report-gateway-service.js

const holism = require("@encapsule/holism");

const { iospecs } = require("../../../../COMMON/rest-api");
const serviceCore = require("../../../../COMMON/service-core");
const appBuild = serviceCore.getAppBuild();

const datastore = require("../../../storage/google-datastore");
const entityKinds = require("../../../storage/data/constants").datastore.entities.kinds;
const { makeDatastoreKey } = require("./utils");

// This service will be made available only to members of the Viewpath organization.
// i.e. external users will not be allowed to create, read, update, delete an organization profile.

const factoryResponse = holism.service.create({

    id: "WeW4sQxmRXqofCgwTRymNA",
    name: "Read Org Projects Report Gateway Service",
    description: "Returns a generated report summarizing all the projects owned by the requesting user's organization.",

    constraints: {

        request: {

            content: { encoding: "utf8", type: "application/json" },
            query_spec: { ____types: "jsUndefined" },

            request_spec: iospecs.requests.readOrgProjectsReport,

            options_spec: { ____types: "jsObject", ____defaultValue: {} }

        }, // #.request

        response: {

            content: { encoding: "utf8", type: "application/json" },

            result_spec: iospecs.results.readOrgProjectsReport,

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
                let readOrgProjectsResponse;
                const appErrors = [];

                try {
                    const orgID = request_.request_descriptor.session.organizationId;

                    readOrgProjectsResponse = new Promise(
                        (resolve_, reject_) => {
                            try {
                                let transaction = datastore.transaction();

                                transaction.run(
                                    (error_, transaction_) => {
                                        // Generate key for OrgProfile
                                        let ancestorKey;
                                        const entityKeyRequest = makeDatastoreKey({kind: entityKinds.orgProfile, orgID});
                                        if(entityKeyRequest.error) {
                                            appErrors.push(entityKeyRequest.error);
                                            resolve_({ appErrors: { appErrors } });
                                            return;
                                        } else {
                                            ancestorKey = entityKeyRequest.result;
                                        }

                                        let query;
                                        try {
                                            query = transaction_.createQuery(entityKinds.project).hasAncestor(ancestorKey);
                                        } catch(queryInitError_) {
                                            console.log(queryInitError_);
                                            appErrors.push({
                                                errorCodeID: "tad89s22SsG64BpPT3IU4A", // "Unexpected error attempting to instantiate transaction query.",
                                                errorCodeSource: "UoVA54NeT8uxXHEZI5KGfw",
                                                errorContext: {
                                                    errorMessage: queryInitError_.message
                                                }
                                            });

                                            resolve_({ appErrors: { appErrors } });
                                            return;
                                        }

                                        transaction_.runQuery(query)
                                            .then( queryResult_ => {
                                                try {
                                                    // TODO: We can get paginated results here, but currently aren't handling them. See if we need to do anything.
                                                    const queryResults = queryResult_[0];
                                                    const report = {
                                                        projects: [],
                                                        tasks: [],
                                                        projectSummaries: {},
                                                        taskSummaries: {}
                                                    };

                                                    // Generate replicas for each query result.
                                                    queryResults.forEach( projectEntity => {
                                                        const project = projectEntity.definition["YXLAvU1ZSlmO4rGgETOxFQ_OrgProject"];
                                                        const projectId = project.id;

                                                        // Generate project specific report fields
                                                        report.projects.push(projectId);
                                                        report.projectSummaries[projectId] = {
                                                            projectId,
                                                            name: project.name || "",
                                                            description: project.description || "",
                                                            taskIds: []
                                                        };

                                                        // Generate task specific report fields
                                                        project.tasks.forEach( taskDefinition => {
                                                            const task = taskDefinition["LvreI3yIQHS8vhoPuBdLLA_ProjectTask"];
                                                            report.tasks.push(task.id);
                                                            report.projectSummaries[projectId].taskIds.push(task.id);
                                                            report.taskSummaries[task.id] = {
                                                                taskId: task.id,
                                                                projectId,
                                                                name: task.name || "",
                                                                description: task.description || "",
                                                                startTime: (task.constraints && task.constraints.startTime) ? task.constraints.startTime.epochTime : null,
                                                                endTime: (task.constraints && task.constraints.endTime) ? task.constraints.endTime.epochTime : null
                                                            };
                                                        });
                                                    });

                                                    try {
                                                        transaction_.rollback();
                                                    } catch(err) {
                                                        // No need to use appError here. It's fine to still return the data I think.
                                                        // TODO: Transaction failing could mean it's hanging and could mean that subsequent reads may not happen
                                                        // and it will report that 'contention' error message instead. Do we report this in addition to returning
                                                        // the project replicas??? The read was fine so the data is good, but also say hey don't try to read
                                                        // again for 10 sec or something like that.
                                                        console.log(err);
                                                    }

                                                    resolve_({ report });
                                                    return;
                                                } catch (queryResultProcessingError_) {
                                                    console.log(queryResultProcessingError_);
                                                    appErrors.push({
                                                        errorCodeID: "JSb4Jvh1TBeSPWpIwsHSqQ", // "Unexpected error while processing the query result."
                                                        errorCodeSource: "ZMsYIHFaQ0a4XD_3pNWtbg",
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
                                                    errorCodeSource: "A013iWzDRieK2eond6w0FA",
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
                                    errorCodeSource: "3iSVwkV-RWGiEtAVBlfh5A",
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
                                        source_tag: "2WXqqlPFQR2zTmwJGlNX4w"
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
                                    source_tag: "D3ORXCo4RD2kCzEi26O-yA"
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
                                source_tag: "IP3RvLnES06q-wYEEKBN4A"
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
