import pino from 'pino'

const logger = pino({
    prettyPrint: {
        ignore: 'pid,hostname'
    }
});

class ServiceLog {
    info_log(msg) {
        logger.info(msg);
    }
}

export default ServiceLog;