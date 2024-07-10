import { useContext, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import { sendMessage } from '~/redux/chat/chatSlice'
import { SendIcon } from '~/assets/svg/index'
import ChatInput from '~/components/Chat/ChatActions/ChatInput'
import SocketContext from '~/context/SocketContext'
import Attachments from '../Attachments/Attachments'
import EmojiPickerApp from '../EmojiPicker/EmojiPickerApp'


const ChatActions = () => {

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const { activeConversation, status } = useSelector((state) => state.chat)
  const { user } = useSelector((state) => state.user)
  const { access_token } = user
  const [message, setMessage] = useState('')
  const textRef = useRef()

  const socket = useContext(SocketContext)


  const values = {
    message,
    conversationId: activeConversation._id,
    files: [],
    access_token
  }

  const SendMessageHandler = async (e) => {
    e.preventDefault()
    if (message === '' ) {
      alert('message can not be blank')
      return
    }
    setLoading(true)
    let newMsg = await dispatch(sendMessage(values))
    socket.emit('sendMessage', newMsg.payload)
    setMessage('')
    setLoading(false)
  }


  return (
    <form
      onSubmit={(e) => SendMessageHandler(e)}
      className="dark:bg-dark_bg_2 h-[60px] w-full flex items-center absolute bottom-0 py-2 px-4 select-none"
    >
      <div className="w-full flex items-center gap-x-2">
        {/*Emojis và attachments*/}
        <ul className="flex gap-x-2">

          <EmojiPickerApp
            textRef={textRef}
            message={message}
            setMessage={setMessage}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            setShowAttachments={setShowAttachments}/>

          <Attachments showAttachments={showAttachments} setShowAttachments={setShowAttachments} setShowPicker={setShowPicker} />
        </ul>

        {/*Input*/}
        <ChatInput message={message} setMessage={setMessage} textRef={textRef} />
        {/*Send button*/}
        <button type="submit" className="btn">
          {status === 'loading' && loading ? (
            <ClipLoader color="#E9EDEF" size={25} />
          ) : (
            <SendIcon className="dark:fill-dark_svg_1" />
          )}
        </button>

      </div>
    </form>
  )
}

export default ChatActions


