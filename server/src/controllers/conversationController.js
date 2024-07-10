import createHttpError from 'http-errors'
import logger from '~/config/logger.js'
import { conversationService } from '~/services/conversationService'
import { userService } from '~/services/userService'

const createAndOpenConversation = async (req, res, next) => {
  try {
    //lấy id của người gửi(sender),người nhận(receiver) và kiểm tra xem là tin nhắn cá nhân hay là nhóm với isGroup
    const senderId = req.jwtDecoded._id
    const { receiverId, isGroup } = req.body

    if (isGroup == false) {
      //kiểm tra nếu có tồn tại id của người nhận
      if (!receiverId) {
        logger.error(
          'please provide the user id you wanna start a conversation with !'
        )
        throw createHttpError.BadGateway('Oops...Something went wrong !')
      }
      //kiểm tra nếu cuộc trò chuyện đã tồn tại trong DB chưa
      const existedConversation = await conversationService.doesConversationExist(senderId, receiverId, false)

      if (existedConversation) {
        //nếu có tồn tại thì trả về phía client dữ liệu cuộc trò chuyện
        res.json(existedConversation)
      } else {
        let receiverUser = await userService.findUserById(receiverId)

        //nếu chưa thì tại 1 cuộc trò chuyện mới
        let conversationData = {
          name: receiverUser.name,
          picture: receiverUser.picture,
          isGroup: false,
          users: [senderId, receiverId]
        }
        //tạo cuộc trò chuyện mới trong DB
        const newConversation = await conversationService.createConversation(conversationData)

        //tổng hợp cuộc trò chuyện mới với thêm thông tin của user
        const populatedConversation = await conversationService.populateConversation(
          newConversation._id,
          'users',
          '-password'
        )

        res.status(200).json(populatedConversation)
      }
    }
  } catch (error) {
    next(error)
  }
}

const getConversations = async (req, res, next) => {
  try {
    const user_id = req.jwtDecoded._id
    const conversations = await conversationService.getUserConversations(user_id)
    res.status(200).json(conversations)
  } catch (error) {
    next(error)
  }
}


export const conversationController = {
  createAndOpenConversation,
  getConversations
}