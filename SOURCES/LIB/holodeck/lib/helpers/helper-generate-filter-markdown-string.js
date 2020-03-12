// helper-generate-filter-markdown-string.js
//
// This is a little wrapper around arctools facility
// that is rather stupid insofar as it relies on handlebars
// and does so in a way that forces inelegant solutions like
// this.

const arctools = require("@encapsule/arctools");
const arccore = arctools.arccore;

const fs = require("fs");
const path = require("path");

let templatePath = path.resolve(path.join(require.resolve("@encapsule/arctools").split("/").slice(0, -1).join("/"), "templates/filter.hbs"));
const templateString = fs.readFileSync(templatePath).toString("utf-8");

module.exports = function(request_) {
    return arctools.filterDocGenerate.request({
        filter: request_.filter,
        template: templateString
    });

}
