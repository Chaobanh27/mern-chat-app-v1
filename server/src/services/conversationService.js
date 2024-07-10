import createHttpError from 'http-errors'
import { conversationModel, UserModel } from '~/models/index'


//kiểm tra nếu cuộc trò chuyện có tồn tại
const doesConversationExist = async (senderId, receiverId, isGroup) => {

  //nếu như không phải là chat nhóm
  if (isGroup === false) {
    let conversation = await conversationModel.find({
      isGroup: false,
      $and: [
        { users: { $elemMatch: { $eq: senderId } } },
        { users: { $elemMatch: { $eq: receiverId } } }
      ]
    })
      .populate('users', '-password')
      .populate('latestMessage')
    //nếu không thấy cuộc trò chuyện
    if (!conversation) {
      throw createHttpError.BadRequest('Oops...Something went wrong !')
    }

    //populate message model
    conversation = await UserModel.populate(conversation, {
      path: 'latestMessage.sender',
      select: 'name email picture status'
    })

    return conversation[0]
  }

  //nếu như là chat nhóm
  else {
    let conversation = await conversationModel.findById(isGroup)
      .populate('users admin', '-password')
      .populate('latestMessage')

    if (!conversation)
      throw createHttpError.BadRequest('Oops...Something went wrong !')
    //populate message model
    conversation = await UserModel.populate(conversation, {
      path: 'latestMessage.sender',
      select: 'name email picture status'
    })

    // return conversation
  }
}

//tạo cuộc trò chuyện mới
const createConversation = async (data) => {
  const newConversation = await conversationModel.create(data)
  if (!newConversation)
    throw createHttpError.BadRequest('Oops...Something went wrong !')
  return newConversation
}

//tổng hợp cuộc trò chuyện mới với dư liệu mới
const populateConversation = async ( id, fieldToPopulate, fieldsToRemove ) => {
  const populatedConversation = await conversationModel.findOne({ _id: id }).populate(
    fieldToPopulate,
    fieldsToRemove
  )
  if (!populatedConversation) {
    throw createHttpError.BadRequest('Oops...Something went wrong !')
  }
  return populatedConversation
}


const getUserConversations = async (user_id) => {
  let conversations
  await conversationModel.find({
    users: { $elemMatch: { $eq: user_id } }
  })
    .populate('users', '-password')
    .populate('admin', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await UserModel.populate(results, {
        path: 'latestMessage.sender',
        select: 'name email picture status'
      })
      conversations = results
    })
    .catch(() => {
      throw createHttpError.BadRequest('Oops...Something went wrong !')
    })
  return conversations
}


const updateLatestMessage = async (conversationId, msg) => {
  const updatedConversation = await conversationModel.findByIdAndUpdate(conversationId, {
    latestMessage: msg
  })
  if (!updatedConversation)
    throw createHttpError.BadRequest('Oops...Something went wrong !')

  return updatedConversation
}

export const conversationService = {
  doesConversationExist,
  createConversation,
  populateConversation,
  getUserConversations,
  updateLatestMessage
}
