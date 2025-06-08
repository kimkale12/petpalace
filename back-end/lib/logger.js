// lib/logger.js
const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `${info.timestamp}[${info.level}] ${info.message}`
        )
      ),
    }),
    new transports.DailyRotateFile({
      filename: "log/%DATE%.log",
      datePattern: "YYYY-MM-DD",
      format: format.combine(
        format.printf((info) => `${info.timestamp}[${info.level}] ${info.message}`)
      ),
    }),
  ],
});

module.exports = logger;