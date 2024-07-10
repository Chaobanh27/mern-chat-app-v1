import winston from 'winston'
import { env } from '~/config/environment'

//Định dạng lại thông báo lỗi trong log nếu có
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})

const logger = winston.createLogger({
  level: env.BUILD_MODE === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    //Tùy thuộc vào biến môi trường env.BUILD_MODE để xác định xem log có được làm màu hay không.
    env.BUILD_MODE === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    //Định dạng cho các đối số truyền vào thông qua logger.info, logger.debug
    winston.format.splat(),
    //Định dạng cuối cùng cho mỗi thông điệp log, hiển thị cấp độ và thông điệp.
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  // Cấu hình các transport (vận chuyển) cho logger
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error']
    }),
    new winston.transports.File({
      filename: 'logs/app.log', // Đường dẫn và tên file log
      level: 'info', // Mức độ log cho transport này
      maxsize: 5242880, // Kích thước tối đa của file log (5MB)
      maxFiles: 5 // Số lượng file log tối đa được giữ lại
    })
  ]
})

export default logger

// To be used as logger.info(message) or logger.error(error)
