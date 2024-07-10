import createHttpError from 'http-errors'
import { messageModel } from '../models/index.js'

//tạo message mới
const createMessage = async (data) => {
  let newMessage = await messageModel.create(data)
  if (!newMessage) {
    throw createHttpError.BadRequest('Oops...Something went wrong !')
  }
  return newMessage
}

//tổng hợp dữ liệu liên quan khác vào message
const populateMessage = async (id) => {

  let msg = await messageModel.findById(id)
    .populate({
      path: 'sender',
      select: 'name picture',
      model: 'UserModel'
    })
    .populate({
      path: 'conversation',
      select: 'name picture isGroup users',
      model: 'ConversationModel',
      populate: {
        path: 'users',
        select: 'name email picture status',
        model: 'UserModel'
      }
    })
  if (!msg) {
    throw createHttpError.BadRequest('Oops...Something went wrong !')
  }

  return msg
}

//lấy toàn bộ tin nhắn của cuộc trò chuyện theo id
const getConversationMessages = async (conversationId) => {
  const messages = await messageModel.find({ conversation: conversationId })
    .populate('sender', 'name picture email status')
    .populate('conversation')
  if (!messages) {
    throw createHttpError.BadRequest('Oops...Something went wrong !')
  }
  return messages
}

export const messageService = {
  createMessage,
  populateMessage,
  getConversationMessages
}
