const winston = require('winston');
const path = require('path');

// Define log levels and their corresponding colors
const logLevels = {
  error: 'red',
  info: 'green'
  
};

// Create  Winston logger instance
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, 'logs', 'application.log')
     
    })
  ]
});

module.exports = logger;
