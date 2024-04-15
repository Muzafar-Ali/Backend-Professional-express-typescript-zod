import pino from 'pino';
import dayjs from 'dayjs';

// Pre-format the timestamp
const formattedTimestamp = `,"time":"${dayjs().format()}"`;

const transport = pino.transport({
 target: 'pino-pretty',
 options: {
    colorize: true, // Enable colorization
    translateTime: 'SYS:standard', // Customize time format
    ignore: 'hostname,pid', // Ignore specific fields
    timestamp: formattedTimestamp, // Use the pre-formatted timestamp
 },
});

const log = pino({
 level: 'info', // Set the log level
}, transport);

export default log;