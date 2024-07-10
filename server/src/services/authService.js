/* eslint-disable no-useless-catch */
import validator from 'validator'
import bcryptjs from 'bcryptjs'
import { UserModel } from '~/models/index'
import { env } from '~/config/environment.js'
import ApiError from '~/utils/ApiError'
import { JwtProvider } from '~/providers/jwtProvider'
import { StatusCodes } from 'http-status-codes'

//env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = env

const createNew = async (reqBody) => {
  const { name, email, picture, status, password } = reqBody

  try {
    //kiểm tra nếu trường bị thiếu
    if (!name || !email || !password) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Please fill all fields.')
    }

    //kiểm tra độ dài tên
    if (
      !validator.isLength(name, {
        min: 2,
        max: 25
      })
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Plase make sure your name is between 2 and 16 characters.')

    }

    //kiểm tra độ dài status
    if (status && status.length > 64) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Please make sure your status is less than 64 characters')

    }

    //kiểm tra nếu email hợp lệ
    if (!validator.isEmail(email)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Please make sure to provide a valid email address.')

    }

    //kiểm tra nếu user đã tồn tại
    const checkDb = await UserModel.findOne({ email })
    if (checkDb) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Please try again with a different email address, this email already exist.')

    }

    //kiểm tra độ dài mật khẩu
    if ( !validator.isLength(password, { min: 6, max: 128 })) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Please make sure your password is between 6 and 128 characters.')
    }

    //thêm user mới vào db
    const user = await new UserModel({
      name,
      email,
      picture: picture || DEFAULT_PICTURE,
      status: status || DEFAULT_STATUS,
      password: bcryptjs.hashSync(password, 8)
    }).save()

    return user
  } catch (error) {
    throw error
  }

}


const login = async (reqBody) => {
  try {
    const email = reqBody.email
    const existUser = await UserModel.findOne({ email: email.toLowerCase() }).lean()

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    // if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')
    }

    const userInfo = { _id: existUser._id, email: existUser.email }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    return {
      accessToken,
      refreshToken,
      message: 'login success.',
      user: {
        _id: existUser._id,
        name: existUser.name,
        email: existUser.email,
        picture: existUser.picture,
        status: existUser.status,
        access_token: accessToken
      }
    }
  } catch (error) { throw error }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    // Bước 01: Thực hiện giải mã refreshToken xem nó có hợp lệ hay là không
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    // Đoạn này vì chúng ta chỉ lưu những thông tin unique và cố định của user trong token rồi, vì vậy có thể lấy luôn từ decoded ra, tiết kiệm query vào DB để lấy data mới.
    const userInfo = { _id: refreshTokenDecoded._id, email: refreshTokenDecoded.email }

    // Bước 02: Tạo ra cái accessToken mới
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      //5 // 5 giây
      env.ACCESS_TOKEN_LIFE
    )

    return { accessToken }
  } catch (error) { throw error }
}

export const authService = {
  createNew,
  login,
  refreshToken
}