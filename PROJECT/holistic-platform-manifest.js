// holistic-platform-manifest.js

const holisticAppPlatformManifestFilter = require('./holistic-platform-manifest-filter');

const filterResponse = holisticAppPlatformManifestFilter.request({
    devDependencies: {
	"arccore": "Encapsule/arccore"
    }
});

if (filterResponse.error) {
    throw new Error(filterResponse.error);
}

module.exports = filterResponse.result;
