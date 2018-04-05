'use strict';
process.on('uncaughtException', (error) => {
    logger.error(error.message, {
        resource: {
            process: 'UncaughtException'
        },
        detail: {
            description: error
        }
    }, () => {
        terminate(1);
    });
});
process.on('unhandledRejection', (error, p) => {
    logger.error(error.message, {
        resource: {
            process: 'UnhandledRejection'
        },
        detail: {
            description: error
        }
    }, () => {
        terminate(1);
    });
});
process.on('applicationError', (error) => {
    logger.error(error.message, {
        resource: {
            process: 'ApplicationError'
        },
        detail: {
            description: error
        }
    }, () => {
        terminate(1);
    });
});
process.on('SIGTERM', () => {
    logger.warn('SIGTERM', {
        resource: {
            process: 'Service terminated with SIGTERM signal'
        }
    }, () => {
        terminate(0);
    });
});
process.on('SIGINT' , () => {
    logger.warn('SIGINT', {
        resource: {
            process: 'Service terminated with SIGINT signal'
        }
    }, () => {
        terminate(0);
    });
});

function terminate(code) {
    agenda.stop((err) => {
        if (err) return process.exit(1);
        process.exit(code);
    });
}