// sources/server/storage/index.js

var redisClient = require('./redis-client');

module.exports = {
    userProfileStore: require('./user-profile-store')(redisClient),
    userSessionStore: require('./user-session-store')(redisClient)
};
