import { authService } from '~/services/authService'
import ms from 'ms'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    const createdUser = await authService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })


    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const logout = async (req, res, next) => {
  try {
    // Xóa cookie - đơn giản là làm ngược lại so với việc gán cookie ở hàm login
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (error) { next(error) }
}

const refreshToken = async (req, res, next) => {
  try {
    const result = await authService.refreshToken(req.cookies?.refreshToken)

    // Trả về một cái cookie accessToken mới sau khi đã refresh thành công
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please Sign In! '))
  }
}


export const authController = {
  createNew,
  login,
  logout,
  refreshToken
}
