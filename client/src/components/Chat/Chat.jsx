import ChatActions from './ChatActions/ChatActions'
import ChatHeader from './ChatHeader/ChatHeader'
import ChatMessages from './Message/ChatMessage'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getConversationMessages } from '~/redux/chat/chatSlice'
import { checkOnlineStatus } from '~/utils/chat'
import FilesPreview from './FilesPreview/FilesPreview'

const Chat = ({ onlineUsers, typing, callUser }) => {

  const dispatch = useDispatch()
  const { activeConversation, files } = useSelector((state) => state.chat)
  const { user } = useSelector((state) => state.user)
  const { access_token } = user

  useEffect(() => {
    const values = {
      access_token,
      conversationId: activeConversation?._id
    }
    if (activeConversation?._id) {
      dispatch(getConversationMessages(values))
    }
  }, [activeConversation, dispatch, access_token])

  return (
    <div className="relative w-full h-full border-l dark:border-l-dark_border_2 select-none overflow-hidden ">
      <div>
        {/*Chat header*/}
        <ChatHeader
          callUser={callUser}
          online={
            activeConversation.isGroup
              ? false
              : checkOnlineStatus(onlineUsers, user, activeConversation.users)
          }
        />
        {files.length > 0 ? (
          <FilesPreview />
        ) : (
          <>
            {/*Chat messages*/}
            <ChatMessages typing={typing} />
            {/* Chat Actions */}
            <ChatActions />
          </>
        )}
      </div>
    </div>
  )
}

export default Chat