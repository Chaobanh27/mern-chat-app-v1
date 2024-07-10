import createHttpError from 'http-errors'
import { UserModel } from '~/models/index'


const findUserById = async (userId) => {
  const user = await UserModel.findById(userId)
  if (!user) throw createHttpError.BadRequest('Please fill all fields.')
  return user
}

const searchUsers = async (keyword, userId) => {
  const users = await UserModel.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { email: { $regex: keyword, $options: 'i' } }
    ]
  }).find({
    _id: { $ne: userId }
  }).select('-password')

  return users
}

export const userService = {
  findUserById,
  searchUsers
}