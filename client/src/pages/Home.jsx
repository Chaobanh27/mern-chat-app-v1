import { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '~/components/Sidebar/Sidebar'
import ChatWelcome from '~/components/Chat/ChatWelcome/ChatWelcome'
import Chat from '~/components/Chat/Chat'
import { getConversations, updateMessagesAndConversations } from '~/redux/chat/chatSlice'
import SocketContext from '~/context/SocketContext'
import Call from '~/components/Call/Call'

const callData = {
  socketId: '',
  receiveingCall: false,
  callEnded: false,
  name: '',
  picture: '',
  signal: ''
}

const Home = () => {

  const [call, setCall] = useState(callData)
  const [stream, setStream] = useState()
  const [show, setShow] = useState(false)
  const { receiveingCall, callEnded, socketId } = call
  const [callAccepted, setCallAccepted] = useState(false)
  const [totalSecInCall, setTotalSecInCall] = useState(0)
  const myVideo = useRef()
  const userVideo = useRef()
  const connectionRef = useRef()

  const [onlineUsers, setOnlineUsers] = useState([])
  const [typing, setTyping] = useState(false)

  const dispatch = useDispatch()
  const { activeConversation } = useSelector((state) => state.chat)
  const { user } = useSelector((state) => state.user)

  const socket = useContext(SocketContext)

  useEffect(() => {
    socket.emit('join', user._id)
    //lắng nghe sự kiện lấy danh sách các user đang online
    socket.on('getOnlineUsers', (users) => {
      setOnlineUsers(users)
    })
  }, [user, socket])

  //lấy các cuộc trò chuyện
  useEffect(() => {
    if (user?.access_token) {
      dispatch(getConversations(user.access_token))
    }
  }, [dispatch, user])


  useEffect(() => {
    //lắng nghe sự kiện nhận tin nhắn
    socket.on('receiveMessage', (message) => {
      dispatch(updateMessagesAndConversations(message))
    })

    socket.on('typing', (conversation) => setTyping(conversation))
    socket.on('stop typing', () => setTyping(false))

  }, [dispatch, socket])

  const callUser = () => {
    enableMedia()
  }

  const answerCall = () => {}
  const endCall = () => {
    setShow(false)
  }
  const setupMedia = () => {}

  const enableMedia = () => {
    setShow(true)
  }

  return (
    <>
      <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
        {/*container*/}
        <div className="container h-screen flex py-[19px]">
          {/*Sidebar*/}
          <Sidebar onlineUsers={onlineUsers} typing={typing} />
          {activeConversation._id ? (
            <Chat
              onlineUsers={onlineUsers}
              callUser = {callUser}
              typing={typing}/>
          ) : (
            <ChatWelcome/>
          )}
        </div>
      </div>


      <div className={(show || call.signal) && !call.callEnded ? '' : 'hidden'}>
        <Call
          call={call}
          setCall={setCall}
          callAccepted={callAccepted}
          myVideo={myVideo}
          userVideo={userVideo}
          stream={stream}
          answerCall={answerCall}
          show={show}
          endCall={endCall}
          totalSecInCall={totalSecInCall}
          setTotalSecInCall={setTotalSecInCall}
        />
      </div>
    </>
  )
}

export default Home


