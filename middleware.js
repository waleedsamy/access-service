var settings = require("./settings");
var storage = require("./storage");
var limiter = require("./limiter");
var logger = require("./logger");
var log = require("./log");


storage.init(settings).then(function() {
    log.info("ubicall access service middlewares are ready to use...");
}).otherwise(function(error) {
    log.error("error initializing ubicall access service...");
    throw error;
});

module.exports = {
    rateLimiter: limiter.rateLimiter,
    rateLimiterReset: limiter.rateLimiterReset,
    logRequest: logger.logRequest
};