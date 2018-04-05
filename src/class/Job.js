'use strict';
const spawn = require('child_process').spawn;
const Crypto = require('mstech-node-cryptography');
const Agenda = require('agenda');
const Config = require('./Config');
const agenda = new Agenda({
    db: {
        address: Config.Cryptography.DISABLED?
            Config.MongoDB:
            Crypto.decrypt(Config.MongoDB),
        collection: 'Scheduler'
    }
});

/**
 * Concurrency set to 100
 */
agenda.maxConcurrency(Config.Job.MAX_CONCURRENCY);

/**
 * Lock life time set to 2 minutes
 */
agenda.defaultLockLifetime(Config.Job.LOCK_LIFETIME);

/**
 * Lock limit set to 100
 */
agenda.defaultLockLimit(Config.Job.LOCK_LIMIT);

Object.defineProperty(global, "agenda", {
    value: agenda,
    enumerable: true,
    writable: false,
    configurable: false
});

function setDefinition(properties) {
    agenda.define(properties.NAME, {concurrency: properties.CONCURRENCY, lockLimit: properties.LOCK_LIMIT}, (job, done) => {
        var stdout = '';
        var stderr = '';
        var params = [
            properties.APP,
            `--config=${properties.CONFIG}`
        ];
        var execution = spawn(process.argv[0], params);
        logger.info(`Started: ${properties.NAME}`, {
            resource: {
                process: 'spawn(process.argv[0], params)',
                params: params
            }
        });

        execution.stdin.once('error', (err) => {
            logger.error(properties.NAME, {
                resource: {
                    process: 'execution.stdin.once("error")',
                    params: params
                },
                detail: {
                    description: err
                }
            }, () => {
                job.fail(err);
                done();
            });
        });
        execution.stdout.on('data', (data) => {
            stdout += data;
        });
        execution.stderr.on('data', (data) => {
            stderr += data;
        });
        execution.on('close', (code, signal) => {
            if (code !== 0 || signal !== null) {
                let err = new Error(`${properties.NAME} Command failed: ${stderr || stdout}`);
                err.code = code;
                err.signal = signal;

                logger.error(properties.NAME, {
                    resource: {
                        process: 'execution.on("close")',
                        params: params
                    },
                    detail: {
                        description: err
                    }
                }, () => {
                    job.fail(err);
                    done();
                });
            } else {
                logger.info(`Finished: ${properties.NAME}`, () => {
                    done();
                });
            }
        });
        execution.on('error', (err) => {
            logger.error(properties.NAME, {
                resource: {
                    process: 'execution.on("error")',
                    params: params
                },
                detail: {
                    description: err
                }
            }, () => {
                job.fail(err);
                done();
            });
        });
    });
}

setDefinition(Config.Job.FILE_ORGANIZER);
setDefinition(Config.Job.PRE_PROCESSOR);
setDefinition(Config.Job.PROCESSOR);
setDefinition(Config.Job.RESULT_SYNC);

agenda.on('ready', () => {
    agenda.every(Config.Job.FILE_ORGANIZER.TIME, Config.Job.FILE_ORGANIZER.NAME);
    agenda.every(Config.Job.PRE_PROCESSOR.TIME, Config.Job.PRE_PROCESSOR.NAME);
    agenda.every(Config.Job.PROCESSOR.TIME, Config.Job.PROCESSOR.NAME);
    agenda.every(Config.Job.RESULT_SYNC.TIME, Config.Job.RESULT_SYNC.NAME);
    agenda.start();
});

agenda.on('error', (error) => {
    proccess.emit('applicationError', error);
});