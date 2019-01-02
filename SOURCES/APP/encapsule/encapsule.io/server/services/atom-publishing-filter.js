// atom-publishing-filter.js

const arccore = require('arccore');
const httpServiceFilterFactory = require('holism').service;

// See: https://tools.ietf.org/html/rfc4287 (Atom Syndication Protocol)

var factoryResponse = httpServiceFilterFactory.create({
    id: "uzdQHchVR5usJ9D0lGqQBQ",
    name: "Atom Syndication Protocol Service Filter",
    description: "Provides a site-wide content syndication feed via Atom Syndication Protocol.",
    constraints: {
        request: {
            content: { encoding: 'utf8', type: 'application/json' },
            query_spec: { ____types: "jsUndefined" },  // reject requests that include URL-encoded search/query parameters.
            request_spec: clientUserProfileSpec,
        },
        response: {
            content: { encoding: 'utf8', type: 'application/json' },
            error_context_spec: { ____opaque: true }, // TODO - schematize the error
            result_spec: clientUserProfileSpec,
        }
    },
    handlers: {
        request_handler: function(request_) {

            var response = { error: null, result: null };
            var errors = [];
            var inBreakScope = true;

            while (!inBreakScope) {
                inBreakScope = true;

                atomXML = [
                    '<?xml version="1.0" encoding="utf-8"?>',
                    '<feed xmlns="http://www.w3.org/2005/Atom">',
                    '<title>Example Feed</title>',
                    '<link href="http://example.org/"/>',
                    '<updated>2003-12-13T18:30:02Z</updated>',
                    '<author>',
                    '<name>John Doe</name>',
                    '</author>',
                    '<id>urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6</id>',
                    '<entry>',
                    '<title>Atom-Powered Robots Run Amok</title>',
                    '<link href="http://example.org/2003/12/13/atom03"/>',
                    '<id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id>',
                    '<updated>2003-12-13T18:30:02Z</updated>',
                    '<summary>Some text.</summary>',
                    '</entry>',
                    '</feed>'
                ];




                break;
            }
            if (errors.length) {
                response.error = errors.join(' ');
            }
            return response; // synchronous return is checked for failure only
        }
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
