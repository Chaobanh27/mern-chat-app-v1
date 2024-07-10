import express from 'express'
import authRoute from '~/routes/v1/authRoute'
import userRoute from '~/routes/v1/userRoute'
import conversationRoute from '~/routes/v1/conversationRoute'
import messageRoute from '~/routes/v1/messageRoute'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/conversation', conversationRoute)
router.use('/message', messageRoute)

export default router

