import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema.Types
const conversationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Conversations name is required.'],
      trim: true
    },
    picture: {
      type: String,
      required: true
    },
    isGroup: {
      type: Boolean,
      required: true,
      default: false
    },
    users: [
      {
        type: ObjectId,
        ref: 'UserModel'
      }
    ],
    latestMessage: {
      type: ObjectId,
      ref: 'MessageModel'
    },
    admin: {
      type: ObjectId,
      ref: 'UserModel'
    }
  },
  {
    collection: 'conversations',
    timestamps: true
  }
)

/**
 * đảm bảo rằng chúng ta luôn có một tham chiếu đến mô hình UserModel, và nếu mô hình đã tồn tại,
 * chúng ta sử dụng lại mô hình đã đăng ký thay vì tạo một lần nữa.
 * Điều này hữu ích trong việc đảm bảo rằng chúng ta không tạo ra nhiều mô hình trùng lặp trong quá trình chạy ứng dụng.
 */
const conversationModel = mongoose.models.ConversationModel || mongoose.model('ConversationModel', conversationSchema)

export default conversationModel
