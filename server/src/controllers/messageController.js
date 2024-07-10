import logger from '~/config/logger.js'
import { conversationService } from '~/services/conversationService'
import { messageService } from '~/services/messageService.js'

const sendMessage = async (req, res, next) => {
  try {
    //lấy id của người gửi
    const userId = req.jwtDecoded._id
    //lấy thông tin khác từ body
    const { message, conversationId, files } = req.body

    // kiểm tra nếu như có tồn tại id cuộc trò chuyện hoặc tin nhắn hay file
    if (!conversationId || (!message && !files)) {
      logger.error('Please provider a conversation id and a message body')
      return res.sendStatus(400)
    }

    //tạo message mới
    const msgData = {
      sender: userId,
      message,
      conversation: conversationId,
      files: files || []
    }
    let newMessage = await messageService.createMessage(msgData)

    let populatedMessage = await messageService.populateMessage(newMessage._id)

    await conversationService.updateLatestMessage(conversationId, newMessage)

    // console.log(populatedMessage)
    res.json(populatedMessage)
  } catch (error) {
    next(error)
  }
}

//lấy toàn bộ message từ params trong url
const getMessages = async (req, res, next) => {
  try {
    const conversationId = req.params.conversationId
    if (!conversationId) {
      logger.error('Please add a conversation id in params.')
      res.sendStatus(400)
    }
    const messages = await messageService.getConversationMessages(conversationId)
    res.json(messages)
  } catch (error) {
    next(error)
  }
}

export const messageController = {
  sendMessage,
  getMessages
}
