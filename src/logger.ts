import { createLogger, transports, format } from 'winston'

const logger = createLogger({
    level: 'debug',
    format: format.json(),
    transports: [
        new transports.File({
            filename: 'logs/logs.log',
        }),
    ],
})

export default logger
