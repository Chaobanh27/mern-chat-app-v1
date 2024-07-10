import express from 'express'
import { authController } from '~/controllers/authController'

const router = express.Router()

router.route('/register').post( authController.createNew)
router.route('/login').post( authController.login)
router.route('/logout').post( authController.logout)
router.route('/refreshtoken').get(authController.refreshToken)

export default router
