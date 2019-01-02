// redis-client.js

var Redis = require('ioredis');

// Set options and allocate a new Redis client that
// will be passed by reference to other modules in this
// directory that encapsulate application-specific
// operations over the data stored in Redis.

var holisticRedisClient = new Redis({
    // This is the default value of `retryStrategy`
    retryStrategy: function (times) {
        // In the event of a Redis outage, delay an addition 500ms before retry for each failed reconnect
        // up to a maximum delay of 1m between reconnect attempts.
        var delay = Math.min(times * 1000, 60000);
        console.log("... " + times + " failed Redis connect attempts. Next attempt in " + delay + "ms.");
        return delay;
    }
});

// ----------------------------------------------------------------------
// connect - emits when a connection is established to the Redis server.
holisticRedisClient.on('connect', function() {
    // console.log("REDIS CONNECT");
});

// ----------------------------------------------------------------------
// ready - If enableReadyCheck is true, client will emit ready when the server reports that it is ready  to receive commands
// (e.g. finish loading data from disk. Otherwise, ready will be emitted immediately right after the connect event.
holisticRedisClient.on('ready', function() {
    console.log("REDIS READY!");
});

// ----------------------------------------------------------------------
// error - emits when an error occurs while connecting. However, ioredis emits all error events silently
// (only emits when there's at least one listener) so that your application.
// won't crash if you're not listening to the error event.
holisticRedisClient.on('error', function() {
    //console.log("REDIS ERROR");
});

// ----------------------------------------------------------------------
// close - emits when an established Redis server connection has closed.
holisticRedisClient.on('close', function() {
    //console.log("REDIS CLOSE");
});

// ----------------------------------------------------------------------
// reconnecting emits after close when a reconnection will be made. The argument of the event is the time (in ms) before reconnecting.
holisticRedisClient.on('reconnecting', function() {
    //console.log("REDIS RECONNECTING...");
});

// ----------------------------------------------------------------------
// emits - after close when no more reconnections will be made, or the connection is failed to establish.
holisticRedisClient.on('end', function() {
    //console.log("REDIS CLIENT END");
});

module.exports = holisticRedisClient;


