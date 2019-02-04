// content-type-spec.js

// Reference:
// https://www.nginx.com/resources/wiki/start/topics/examples/full/
// http://stackoverflow.com/questions/2871655/proper-mime-type-for-fonts

module.exports = {
    ____label: "Content Type",
    ____description: "The value of the Content-Type header to return along with the indicated resource.",
    ____accept: "jsString",
    ____inValueSet: [
        "application/x-font-ttf",
        "application/font-woff",
        "application/font-woff2",
        "application/javascript",
        "application/json",
        "image/jpeg",
        "image/gif",
        "image/png",
        "image/svg+xml",
        "image/x-icon",
        "text/css",
        "text/html",
        "text/plain"
    ]
};
