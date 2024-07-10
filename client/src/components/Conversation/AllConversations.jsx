import { useSelector } from 'react-redux'
import Conversation from './Conversation'
import { checkOnlineStatus } from '~/utils/chat'

const AllConversations = ({ onlineUsers, typing }) => {
  const { conversations, activeConversation } = useSelector((state) => state.chat)
  const { user } = useSelector((state) => state.user)

  return (
    <div className="convos scrollbar">
      <ul>
        {conversations &&
          conversations
            .filter(
              (c) =>
                c.latestMessage ||
                c._id === activeConversation._id ||
                c.isGroup == true
            )
            .map((c) => {
              let check = checkOnlineStatus(onlineUsers, user, c.users)
              return (
                <Conversation
                  conversation={c}
                  key={c._id}
                  online={!c.isGroup && check ? true : false}
                  typing={typing}
                />
              )
            })}
      </ul>
    </div>
  )
}

export default AllConversations
