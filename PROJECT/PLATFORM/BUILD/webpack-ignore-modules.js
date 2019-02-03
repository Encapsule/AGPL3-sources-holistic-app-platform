var fs = require('fs');

module.exports = fs.readdirSync('node_modules').filter(function(packageName) {
    // Identify external dependencies installed in 'node_modules' directory.
    // Webpack will not pack these external modules. So, any package that we
    // do actually want bundled in the packed output needs to be dropped
    // by this filter.
    var includeInPackedOutput = false
    switch (packageName) {
    case 'uuid':
    case 'murmurhash-js':
        includeInPackedOutput = true;
        break;
    default:
        break;
    }
    //console.log("Include '" + packageName + "'? " + includeInPackedOutput);
    return !includeInPackedOutput; // Confusing, but correct.
});

