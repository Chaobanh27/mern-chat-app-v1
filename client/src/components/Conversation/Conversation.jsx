import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SocketContext from '~/context/SocketContext'
import { createOpenConversation } from '~/redux/chat/chatSlice'
import { getConversationId, getConversationName, getConversationPicture } from '~/utils/chat'
import { dateHandler } from '~/utils/date'
import { capitalize } from '~/utils/string'

function Conversation({ conversation, online, typing }) {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { activeConversation } = useSelector((state) => state.chat)
  const { access_token } = user

  const socket = useContext(SocketContext)

  const values = {
    receiverId: getConversationId(user, conversation.users),
    isGroup: conversation.isGroup ? conversation._id : false,
    access_token
  }

  const openConversation = async () => {
    let newConversation = await dispatch(createOpenConversation(values))
    socket.emit('joinConversation', newConversation.payload._id)
  }

  return (
    <li
      onClick={() => openConversation()}
      className={`list-none h-[72px] w-full dark:bg-dark_bg_1 hover:${
        conversation._id !== activeConversation._id ? 'dark:bg-dark_bg_2' : ''
      } cursor-pointer dark:text-dark_text_1 px-[10px] ${
        conversation._id === activeConversation._id ? 'dark:bg-dark_hover_1' : ''
      }`}
    >

      <div className="relative w-full flex items-center justify-between py-[10px]">
        {/*tin nhắn của bạn bè*/}
        <div className="flex items-center gap-x-3">
          {/*hình ảnh cuộc trò chuyện*/}
          <div
            className={`relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden ${
              online ? 'online' : ''
            }`}
          >
            <img
              src={
                conversation.isGroup
                  ? conversation.picture
                  : getConversationPicture(user, conversation.users)
              }
              alt="picture"
              className="w-full h-full object-cover "
            />
          </div>

          <div className="w-full flex flex-col">
            {/*tên cuộc trò chuyện*/}
            <h1 className="font-bold flex items-center gap-x-2">
              {conversation.isGroup
                ? conversation.name
                : capitalize(getConversationName(user, conversation.users))}
            </h1>
            {/* tin nhắn cuộc trò chuyện */}
            <div>
              <div className="flex items-center gap-x-1 dark:text-dark_text_2">
                <div className="flex-1 items-center gap-x-1 dark:text-dark_text_2">
                  {typing === conversation._id ? (
                    <p className="text-green_1">Typing...</p>
                  ) : (
                    <p>
                      {conversation.latestMessage?.message.length > 25
                        ? `${conversation.latestMessage?.message.substring(0, 25)}...`
                        : conversation.latestMessage?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*tin nhắn của mình*/}
        <div className="flex flex-col gap-y-4 items-end text-xs">
          <span className="dark:text-dark_text_2">
            {conversation.latestMessage?.createdAt
              ? dateHandler(conversation.latestMessage?.createdAt)
              : ''}
          </span>
        </div>
      </div>
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  )
}

export default Conversation
