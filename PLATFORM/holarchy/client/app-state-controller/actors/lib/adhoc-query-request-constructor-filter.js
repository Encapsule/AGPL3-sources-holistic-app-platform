// sources/client/app-state-controller/actors/lib/submit-query-helper-filter.js
/*
  TODO: Perform a design review and consider scrapping this helper filter
  in favor of a purpose-built implementation directly in the state actor filter
  itself.

  - We should not duplicate work that's intended to be performed by read/write
  filters. Migrate filter specs to ADS namespace(s) and rely on common infrastructure.

  - The inputs are seemingly obtained from read filters. And, the output
  is destined for a write filter. The important thing to get straight
  is the app data store filter spec.
*/

const arccore = require("arccore");

const METRICS = ["REACH", "COMPOSITION", "AFFINITY"];



var factoryResponse = arccore.filter.create({
    operationID: "iCz_EYt3SiSvig2M_AUYHQ",
    operationName: "Ad Hoc Query Request Constructor Filter",
    operationDescription: "Filter to create the body for an Adhoc table report POST request from the Rainier REST API from a set of params contained in a request object.",

    inputFilterSpec: {
        ____label: "Adhoc table report input",
        ____description: "Specifies the inputs required to make a request for an AdHoc table report from the Rainier REST API",
        ____types: "jsObject",
        dateRange: {
            ____label: "Date range of the query",
            ____description: "Date range object using epochs for the bounds of the range",
            ____types: "jsObject",
            start: {
                ____label: "Time interval start",
                ____description: "An epoch which is the start of the time interval for the query",
                ____accept: "jsNumber",
            },
            end: {
                ____label: "Time interval end",
                ____description: "An epoch which is the end of the time interval of the query.",
                ____accept: "jsNumber",
            }
        },
        targetSegments: {
            ____label: "target segments",
            ____description: "target segments for the query",
            ____types: "jsArray",
            element: {
                ____accept: "jsObject"
            },
        },
        baselineSegments: {
            ____label: "baseline segments",
            ____description: "Baseline segments for the query",
            ____types: "jsArray",
            element: {
                ____accept: "jsObject"
            },
        },
        characteristics: {
            ____label: "Characteristics",
            ____description: "An array of characteristics to be used by the query",
            ____types: "jsArray",
            element: {
                ____types: "jsObject",
                name: {
                    ____accept: "jsString",
                }
            }
        },

    },

    bodyFunction: function (request) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            if(request.dateRange.start >= request.dateRange.end){
                errors.push("Date range end must be greater than the start");
            }
            if (request.targetSegments.size < 1){
                errors.push("Target segments cannot be empty");
            }
            if (request.baselineSegments.size < 1){
                errors.push("Baseline segments cannot be empty");
            }
            if (request.characteristics.size < 1){
                errors.push("Characteristics cannot be empty");
            }
            if(errors.length > 0){
                break;
            }

            let rowCategories = [];

            request.characteristics.forEach( (characteristic) => {
                rowCategories.push(characteristic.name);
            });

            try {
                response.result = {
                    startTimeSeconds: Math.round(request.dateRange.start/1000),
                    endTimeSeconds: (request.dateRange.end/1000),
                    tableReport: {
                        rowCategories: rowCategories,
                        columns: [getCombinedSegment(request.targetSegments)],
                        baseline: getCombinedSegment(request.baselineSegments),
                        metrics: METRICS
                    }
                };
            } catch (exception){
                errors.push(exception);
            }
        }
        if (errors.length) response.error = errors.join(" ");
        return response;
    },

    outputFilterSpec: {
        ____label: "Adhoc table report request body",
        ____description: "The specification for an object that is a suitable request body for a POST request to the Adhoc table" +
            "endpoint.",
        ____types: "jsObject",
        startTimeSeconds: {
            ____accept: "jsNumber",
        },
        endTimeSeconds: {
            ____accept: "jsNumber",
        },
        tableReport: {
            ____types: "jsObject",
            rowCategories: {
                ____types: "jsArray",
                element: {
                    ____types: "jsString",
                }
            },
            columns: {
                ____accept: "jsArray",
            },
            baseline: {
                ____accept: "jsObject",
            },
            metrics: {
                ____accept: "jsArray",
            }
        }
    },

});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);


/*
 * Combines segment selections in to a single segment. Segments in same
 * category are unioned, followed by an intersection across categories.
 *
 * @param type - segment selection type to be combined, TARGET or BASELINE.
 * @returns - A combination of all segments in the collection.
 */
const getCombinedSegment = function(segments) {

    // Merge segment lists recursively in to single segment definition.
    function merge(segments, op) {
        const obj = {};
        const len = segments.length;
        switch (len) {
        case 0:
            return null;
        case 1:
            return segments[0];
        case 2:
            obj[op] = {
                a: segments[0],
                b: segments[1]
            };
            return obj;
        default:
            var mid = (len - 1) / 2;
            obj[op] = {
                a: merge(segments.slice(0, mid), op),
                b: merge(segments.slice(mid, len), op)
            };
            return obj;
        }
    }

    const segmentMap = {};
    segments.forEach((segment) => {
        const s = {
            id: segment.id,
            name: segment.name,
            category: segment.category,
            intersection: (segment.intersection) ? segment.intersection: null,
            union: (segment.union) ? segment.union : null,
            tagSelector: segment.tagSelector
        };
        if (segment.category in segmentMap) {
            segmentMap[segment.category].push(s);
        } else {
            segmentMap[segment.category] = [s];
        }
    });
    const categoryMerge = [];
    Object.keys(segmentMap).forEach((key) => {
        categoryMerge.push(merge(segmentMap[key], "union"));
    });
    return merge(categoryMerge, "intersection");
};

// Ad Hoc Query Request Constructor Filter
module.exports = factoryResponse.result;



