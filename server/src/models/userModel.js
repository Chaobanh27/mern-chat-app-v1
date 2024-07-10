import mongoose from 'mongoose'
import validator from 'validator'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name']
    },
    email: {
      type: String,
      required: [true, 'Please provide tour email address'],
      unqiue: [true, 'This email address already exist'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address']
    },
    picture: {
      type: String,
      default:
        'https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png'
    },
    status: {
      type: String,
      default: 'Hey there ! I am using whatsapp'
    },
    password: {
      type: String,
      required: [true, 'Please provide your password'],
      minLength: [
        6,
        'Plase make sure your password is atleast 6 characters long'
      ],
      maxLength: [
        128,
        'Plase make sure your password is less than 128 characters long'
      ]
    }
  },
  {
    collection: 'users',
    timestamps: true
  }
)

/**
 * đảm bảo rằng chúng ta luôn có một tham chiếu đến mô hình UserModel, và nếu mô hình đã tồn tại,
 * chúng ta sử dụng lại mô hình đã đăng ký thay vì tạo một lần nữa.
 * Điều này hữu ích trong việc đảm bảo rằng chúng ta không tạo ra nhiều mô hình trùng lặp trong quá trình chạy ứng dụng.
 */
const userModel = mongoose.models.UserModel || mongoose.model('UserModel', userSchema)

export default userModel
