// view-store/index.js

const appSiteStaticMetadataDeclaration = require('./app-site-static-metadata-declaration');
const viewStoreConstructor = require('./view-store-constructor');

const constructorResponse = viewStoreConstructor.request(appSiteStaticMetadataDeclaration);

if (constructorResponse.error) {
    throw new Error(constructorResponse.error);
}

module.exports = constructorResponse.result;
