// PROJECT/PACKAGES/index.js

const packageDB = {
    // Encapsule Project "holistic application" framework library packages.
    holism: require('./holism'),
    hrequest: require('./hrequest'),

    // Encapsule Project holistic applications.
    // DEPRECATED ---> app_encapsule_io: require('./app_encapsule_io')
};

module.exports = packageDB;
