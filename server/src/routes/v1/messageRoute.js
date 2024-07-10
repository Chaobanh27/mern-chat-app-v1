import express from 'express'
import { messageController } from '~/controllers/messageController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const router = express.Router()

router.route('/').post( authMiddleware.isAuthorized, messageController.sendMessage)

router.route('/:conversationId').get( authMiddleware.isAuthorized, messageController.getMessages)

export default router
