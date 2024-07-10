
let onlineUsers = []

export default function (socket, io) {
  socket.on('join', (userID) => {
    socket.join(userID)

    if (!onlineUsers.some((u) => u.userId === userID)) {
      onlineUsers.push({
        userId : userID,
        socketId : socket.id
      })
    }

    io.emit('getOnlineUsers', onlineUsers)

    io.emit('setupSocket', socket.id)
  })

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    io.emit('getOnlineUsers', onlineUsers)
  })


  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId)
  })

  //hàm xử lý gủi và nhận tin nhắn
  socket.on('sendMessage', (message) => {
    let conversation = message.conversation
    if (!conversation.users) {
      return
    }
    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) {
        return
      }
      socket.in(user._id).emit('receiveMessage', message)
    })
  })

  //hàm xử lý sự kiện user đang gõ
  socket.on('typing', (conversation) => {
    socket.in(conversation).emit('typing', conversation)
  })
  socket.on('stopTyping', (conversation) => {
    socket.in(conversation).emit('stop typing')
  })

}