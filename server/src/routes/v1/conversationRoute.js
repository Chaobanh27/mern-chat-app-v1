import express from 'express'
import { conversationController } from '~/controllers/conversationController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const router = express.Router()

router.route('/')
  .post( authMiddleware.isAuthorized, conversationController.createAndOpenConversation)
router.route('/')
  .get( authMiddleware.isAuthorized, conversationController.getConversations)

export default router
