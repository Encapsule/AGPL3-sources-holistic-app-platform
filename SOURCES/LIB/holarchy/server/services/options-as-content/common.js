/**
 Common things used by options as content.
 **/

 const contentTypeLUT = {
    html: 'text/html',
    json: 'application/json'
};

const constraints = {
  request: {
    content: {encoding: 'utf8', type: 'text/plain'},
    query_spec: {
      ____types: "jsObject",
      ____defaultValue: {},
      format: {
        ____accept: "jsString",
        ____defaultValue: "html",
        ____inValueSet: ['html', 'json']
      }
    },
    request_spec: {____opaque: true},
    options_spec: {
      ____label: "HTML Content Render Request Descriptor",
      ____description: "A HTML content render request descriptor to be passed directly to the HTML rendering subsystem at runtime.",
      ____accept: "jsObject",
      ____defaultValue: {"uURRenqiTtmzrce5eRXARQ": {message: "YOU MUST SPECIFY AN SERVICE OPTIONS OBJECT!"}}
    }
  },
  response: {
    content: {encoding: 'utf8', type: 'text/html'},
    error_context_spec: {____opaque: true},
    result_spec: {____opaque: true}
  }
};

module.exports = 
{
  constraints: constraints,
  contentTypeLUT: contentTypeLUT
};