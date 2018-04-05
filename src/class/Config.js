"use strict";
var ConfigBase = require('../lib/omr-base/config/Config');

class Config extends ConfigBase {

    /**
     * Get process definition
     * @return {Object} Process definition
     * @static
     */
    static get Job() {
        return {
            MAX_CONCURRENCY: Config.resource.JOB_MAX_CONCURRENCY || 20,
            LOCK_LIFETIME: Config.resource.JOB_LOCK_LIFETIME || 2000,
            LOCK_LIMIT: Config.resource.JOB_LOCK_LIMIT || 100,
            FILE_ORGANIZER: {
                NAME: Config.resource.JOB_FILE_ORGANIZER_NAME || 'File Organizer',
                APP: Config.resource.JOB_FILE_ORGANIZER_APP,
                CONFIG: Config.resource.JOB_FILE_ORGANIZER_CONFIG,
                TIME: Config.resource.JOB_FILE_ORGANIZER_TIME,
                CONCURRENCY: 0,
                LOCK_LIMIT: 1
            },
            PRE_PROCESSOR: {
                NAME: Config.resource.JOB_PRE_PROCESSOR_NAME || 'Pre Processor',
                APP: Config.resource.JOB_PRE_PROCESSOR_APP,
                CONFIG: Config.resource.JOB_PRE_PROCESSOR_CONFIG,
                TIME: Config.resource.JOB_PRE_PROCESSOR_TIME,
                CONCURRENCY: Config.resource.JOB_PRE_PROCESSOR_CONCURRENCY || 4,
                LOCK_LIMIT: Config.resource.JOB_PRE_PROCESSOR_LOCK_LIMIT || 4
            },
            PROCESSOR: {
                NAME: Config.resource.JOB_PROCESSOR_NAME || 'Processor',
                APP: Config.resource.JOB_PROCESSOR_APP,
                CONFIG: Config.resource.JOB_PROCESSOR_CONFIG,
                TIME: Config.resource.JOB_PROCESSOR_TIME,
                CONCURRENCY: Config.resource.JOB_PROCESSOR_CONCURRENCY || 4,
                LOCK_LIMIT: Config.resource.JOB_PROCESSOR_LOCK_LIMIT || 4
            },
            RESULT_SYNC: {
                NAME: Config.resource.JOB_RESULT_SYNC_NAME || 'Result Sync',
                APP: Config.resource.JOB_RESULT_SYNC_APP,
                CONFIG: Config.resource.JOB_RESULT_SYNC_CONFIG,
                TIME: Config.resource.JOB_RESULT_SYNC_TIME,
                CONCURRENCY: 0,
                LOCK_LIMIT: 1
            }
        }
    }
}

module.exports = Config;
