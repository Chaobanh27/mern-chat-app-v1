import createHttpError from 'http-errors'
import logger from '~/config/logger'
import { userService } from '~/services/userService'

export const searchUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search
    const userId = req.jwtDecoded._id
    if (!keyword) {
      logger.error('Please add a search query first')
      throw createHttpError.BadRequest('Oops...Something went wrong !')
    }
    const users = await userService.searchUsers(keyword, userId)
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  searchUsers
}