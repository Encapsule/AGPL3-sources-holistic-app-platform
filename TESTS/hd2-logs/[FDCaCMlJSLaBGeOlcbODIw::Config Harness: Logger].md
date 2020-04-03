# Filter Object README

## [FDCaCMlJSLaBGeOlcbODIw::Config Harness: Logger]

**Configures logging options for a holodeck subprogram.**

### Operation

This operation is dispatched by calling the filter object's `request` method passing a single value `input`:

```JavaScript
var response = filter.request(input);
if (response.error) {
    throw new Error(response.error); // <- response.result invalid
}
var result = response.result; // <- response.result valid
```

### Request Input

This filter normalizes the value of `input` passed to its `request` method using the following filter spec contract:

```JavaScript
{
    "____label": "Holodeck Harness Request",
    "____description": "Defines the outer format of all holodeck harness plug-in filter requests.",
    "____types": "jsObject",
    "context": {
        "____label": "Holodeck Harness Dispatch Context",
        "____description": "A structure passed down through the holodeck harness filters selected to execute a holodeck program that tracks configuration and log locations.",
        "____types": "jsObject",
        "logRootDir": {
            "____label": "Log Root Directory",
            "____description": "The local filesystem directory path set as the root of this holodeck environment's program evaluation logs structure. Does not change.",
            "____accept": "jsString"
        },
        "logCurrentDirPath": {
            "____label": "Current Log Directory Tokens",
            "____description": "An array of directory name(s) to be joined w/logRootDir to deduce the directory path into which test harness evaluation logs from the sub-program request should be written.",
            "____types": "jsArray",
            "____defaultValue": [],
            "directoryName": {
                "____label": "Subdirectory Name",
                "____description": "The name of a subdirectory in which tests that occur in the subprogram should be written when they are evaluated.",
                "____accept": "jsString"
            }
        },
        "programRequestPath": {
            "____label": "Program Request Path",
            "____description": "An array of tokens derived from parsing a programRequest tree that is used to report diagnostic and error messages (e.g. the path in a programRequest that contains a syntax error).",
            "____types": "jsArray",
            "____defaultValue": [],
            "requestPathToken": {
                "____label": "Program Request Token",
                "____description": "Start always with ~ indicating the programRequest itself. Additional tokens follow arccore.filter path conventions for logs and errors messages.",
                "____accept": "jsString"
            }
        },
        "config": {
            "____label": "Program Configuration",
            "____description": "A structure passed down though the holodeck harness tree selected to process a programRequest tree that tracks configuration information used to inform specific details and customizations of the sub-program request.",
            "____types": "jsObject",
            "____asMap": true,
            "____defaultValue": {},
            "configName": {
                "____label": "Configuration Data",
                "____description": "Either an object or a string set by a holodeck configuration harness. There is not pre-specified schema for holodeck options; this detail is up to holodeck config harness authors.",
                "____opaque": true
            }
        }
    },
    "programRequest": {
        "____label": "Holodeck Program Request",
        "____description": "A holodeck program request descriptor object to be evaluated via a holodeck harness plug-in filter call.",
        "____types": "jsObject",
        "id": {
            "____label": "Program Request ID",
            "____description": "A unique IRUT ID used to identify this program request object.",
            "____accept": "jsString"
        },
        "name": {
            "____label": "Program Request Name",
            "____description": "A short descriptive name to be used in log files.",
            "____accept": "jsString"
        },
        "description": {
            "____label": "Program Request Description",
            "____description": "A short description of the program request (e.g. what it does in brief/why).",
            "____accept": "jsString"
        },
        "config": {
            "____types": "jsObject",
            "logger": {
                "____types": "jsObject",
                "options": {
                    "____types": "jsObject",
                    "____defaultValue": {}
                },
                "programRequest": {
                    "____accept": [
                        "jsObject",
                        "jsArray",
                        "jsNull"
                    ],
                    "____defaultValue": null
                }
            }
        }
    }
}
```


### Response Output

This filter's `request` method returns a normalized `response` object when called.

```JavaScript
var response = filter.request(input);
var result = undefined; // assume nothing
// You must check for an error condition.
if (!response.error) {
    // Operation succeeded and response.result is a valid value.
    result = response.result;
} else {
    // Operation failed and response.error is a string error message.
    throw new Error(response.error); // e.g.
}
// Use value held by result variable for subsequent operations...
```
#### Result Format


If no error then the value assigned to `response.result` is normalized per the following filter spec contract:

```JavaScript
{
    "____label": "Holodeck Harness Result",
    "____description": "Structure returned to Holodeck.runProgram method for further processing.",
    "____types": "jsObject",
    "context": {
        "____label": "Holodeck Harness Dispatch Context",
        "____description": "A structure passed down through the holodeck harness filters selected to execute a holodeck program that tracks configuration and log locations.",
        "____types": "jsObject",
        "logRootDir": {
            "____label": "Log Root Directory",
            "____description": "The local filesystem directory path set as the root of this holodeck environment's program evaluation logs structure. Does not change.",
            "____accept": "jsString"
        },
        "logCurrentDirPath": {
            "____label": "Current Log Directory Tokens",
            "____description": "An array of directory name(s) to be joined w/logRootDir to deduce the directory path into which test harness evaluation logs from the sub-program request should be written.",
            "____types": "jsArray",
            "____defaultValue": [],
            "directoryName": {
                "____label": "Subdirectory Name",
                "____description": "The name of a subdirectory in which tests that occur in the subprogram should be written when they are evaluated.",
                "____accept": "jsString"
            }
        },
        "programRequestPath": {
            "____label": "Program Request Path",
            "____description": "An array of tokens derived from parsing a programRequest tree that is used to report diagnostic and error messages (e.g. the path in a programRequest that contains a syntax error).",
            "____types": "jsArray",
            "____defaultValue": [],
            "requestPathToken": {
                "____label": "Program Request Token",
                "____description": "Start always with ~ indicating the programRequest itself. Additional tokens follow arccore.filter path conventions for logs and errors messages.",
                "____accept": "jsString"
            }
        },
        "config": {
            "____label": "Program Configuration",
            "____description": "A structure passed down though the holodeck harness tree selected to process a programRequest tree that tracks configuration information used to inform specific details and customizations of the sub-program request.",
            "____types": "jsObject",
            "____asMap": true,
            "____defaultValue": {},
            "configName": {
                "____label": "Configuration Data",
                "____description": "Either an object or a string set by a holodeck configuration harness. There is not pre-specified schema for holodeck options; this detail is up to holodeck config harness authors.",
                "____opaque": true
            }
        }
    },
    "pluginResult": {
        "____accept": "jsUndefined"
    },
    "programRequest": {
        "____label": "Holodeck Subprogram Request",
        "____description": "Evaluation of a holodeck plug-in harness filter may produce a subprogram to be evaluated by holodeck environment using the environment context specified by //.context.",
        "____accept": [
            "jsArray",
            "jsObject",
            "jsNull"
        ],
        "____defaultValue": null
    }
}
```


## Implementation

### Identifiers

| filter identifier | version independent | version dependent |
|--------|---------------------|-------------------|
| operation | `FDCaCMlJSLaBGeOlcbODIw` | `FhSzVwPDxVv2XcQmaDbinQ` |
| input contract | `Ccir6qlk6YwBCNb1uCJ-VQ` | `qX3Mo9GnXEvck52j-QiHKg` |
| output contract | `ivIp4A6HrByWYfaUwQylwQ` | `rHTEpVSEIxD3LbaIFGRH-w` |

### Configuration
Filter classification:  **normalized operation**

| request stage | stage description | state |
|-------|---------|---------------|
| 1. Input Filter | Rejects invalid input requests and shapes to well-formed. | true |
| 2. Operation | Developer-defined custom data transformation function. | true |
| 3. Response Filter | Verifies the response of the developer-defined operation function. | true |
| 4. Output Filter | Rejects invalid output result data and shapes to well-formed. | true |

## About
Filters are created with the [Encapsule/arccore](https://github.com/Encapsule/arccore/) library.<br>
This document was generated with [Encapsule/arctools](https://github.com/Encapsule/arctools/) v0.1.9 toolset.<br>
Document updated Fri Apr 03 2020 12:09:36 GMT-0700 (Pacific Daylight Time)

