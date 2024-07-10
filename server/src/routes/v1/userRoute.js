import express from 'express'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const router = express.Router()

router.route('/').get(authMiddleware.isAuthorized, userController.searchUsers)

export default router
