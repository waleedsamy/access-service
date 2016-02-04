var when = require("when");
var moment = require("moment");
var CronJob = require("cron").CronJob;
var settings = require("./settings");
var log = require("./log");
var storage = require("./storage");

var aggregateEvery;

var DEVENV = (process.env.node_env === "development" || process.env.node_env === "test");
if (DEVENV) {
    aggregateEvery = "* * * * *";
    log.info("aggregate logs every minute");
} else {
    aggregateEvery = "0 */1 * * *";
    log.info("aggregate logs every one hour");
}

storage.init(settings).then(function() {

    process.title = "api-access";
    log.info("Server use configuration version " + process.env.config_version);
    log.info("Server running now on " + process.env.node_env + " Mode - Avialable options are : test ,development ,production ");
    log.info("DB connections use " + process.env.db_env + " Mode - Avialable options are : internal ,external ");
    log.help("To stop app gracefully just type in shell pkill api-access");


    var job = new CronJob(aggregateEvery, function() {
        storage.aggregateLogs().then(function() {
            if (DEVENV) {
                log.info("aggregate Logs done successfully " + new Date());
            }
        }).otherwise(function(err) {
            if (DEVENV) {
                log.info("nothing to aggregate ");
            }
        });
    }, null, true, null);


});

process.on("uncaughtException", function(err) {
    log.error("[api-access] Uncaught Exception:");
    if (err.stack) {
        log.error(err.stack);
    } else {
        log.error(err);
    }
    process.exit(1);
});

process.on("unhandledRejection", function(err) {
    log.error("[api-access] unhandled Rejection:");
    if (err.stack) {
        log.error(err.stack);
    } else {
        log.error(err);
    }
    // in production forever daemon will restart the app , so don"t worry
    // should we use cluster and fork node app here ??!!
    process.exit(1);
});

process.on("SIGINT", function() {
    log.prompt("[api-access] IS DOWN NOW");
    process.exit();
});