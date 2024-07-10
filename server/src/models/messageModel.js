import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: ObjectId,
      ref: 'UserModel'
    },
    message: {
      type: String,
      trim: true
    },
    conversation: {
      type: ObjectId,
      ref: 'ConversationModel'
    },
    files: []
  },
  {
    collection: 'messages',
    timestamps: true
  }
)

/**
 * đảm bảo rằng chúng ta luôn có một tham chiếu đến mô hình UserModel, và nếu mô hình đã tồn tại,
 * chúng ta sử dụng lại mô hình đã đăng ký thay vì tạo một lần nữa.
 * Điều này hữu ích trong việc đảm bảo rằng chúng ta không tạo ra nhiều mô hình trùng lặp trong quá trình chạy ứng dụng.
 */
const messageModel = mongoose.models.MessageModel || mongoose.model('MessageModel', messageSchema)

export default messageModel
