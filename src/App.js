'use strict';
const Config = require('./class/Config');
const Enumerator = require('./lib/omr-base/class/Enumerator');
var mongo;
Config.init();

mongo = require('./lib/omr-base/class/Database')(Config.MongoDB);

require('./lib/omr-base/class/Log')({
    db: mongo.db,
    connectionString: Config.MongoDB,
    label: Enumerator.LogType.TASK_SCHEDULER,
    level: Config.KeepLogLevel
});

require('./class/Job');
require('./class/Event');