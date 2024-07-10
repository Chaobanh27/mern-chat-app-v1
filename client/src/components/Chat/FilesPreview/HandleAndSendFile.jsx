import { useDispatch, useSelector } from 'react-redux'
import { CloseIcon, SendIcon } from '~/assets/svg/index'
import { uploadFiles } from '~/utils/upload'
import { useContext, useState } from 'react'
import { removeFileFromFiles, sendMessage } from '~/redux/chat/chatSlice'
import ClipLoader from 'react-spinners/ClipLoader'
import VideoThumbnail from 'react-video-thumbnail'
import FilesPreviewAdd from './FilesPreviewAdd'
import { getFileImage } from '~/utils/FileImage'
import SocketContext from '~/context/SocketContext'

const HandleAndSendFile = ({ activeIndex, setActiveIndex, message }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { files, activeConversation } = useSelector((state) => state.chat)
  const { user } = useSelector((state) => state.user)
  const { access_token } = user

  const socket = useContext(SocketContext)

  const sendMessageHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    const uploadedFiles = await uploadFiles(files)

    const values = {
      access_token,
      message,
      conversationId: activeConversation._id,
      files: uploadedFiles.length > 0 ? uploadedFiles : []
    }

    let newMsg = await dispatch(sendMessage(values))
    socket.emit('sendMessage', newMsg.payload)
    setLoading(false)
  }


  const handleRemoveFile = (index) => {
    dispatch(removeFileFromFiles(index))
  }

  return (
    <div className="w-[97%] flex items-center justify-between mt-2 border-t dark:border-dark_border_2">
      {/*Empty*/}
      <span></span>
      {/*List files*/}
      <div className="flex items-center gap-x-2">
        {files.map((file, i) => (
          <div
            key={i}
            className={`fileThumbnail relative w-14 h-14 border dark:border-white mt-2 rounded-md overflow-hidden cursor-pointer
            ${activeIndex === i ? 'border-[3px] !border-green_1' : ''}
            `}
            onClick={() => setActiveIndex(i)}
          >
            {file.type === 'IMAGE' ? (
              <img
                src={file.fileData}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : file.type === 'VIDEO' ? (
              <VideoThumbnail videoUrl={file.fileData} />
            ) : (
              <img
                src={getFileImage(file.type)}
                alt=""
                className="w-8 h-10 mt-1.5 ml-2.5"
              />
            )}
            {/*Remove file icon*/}
            <div
              className="removeFileIcon hidden"
              onClick={() => handleRemoveFile(i)}
            >
              <CloseIcon className="dark:fill-white absolute right-0 top-0 w-4 h-4" />
            </div>
          </div>
        ))}
        {/* Add another file */}
        <FilesPreviewAdd setActiveIndex={setActiveIndex} />
      </div>
      {/*Send button*/}
      <div
        className="bg-green_1 w-16 h-16 mt-2 rounded-full flex items-center justify-center cursor-pointer"
        onClick={(e) => sendMessageHandler(e)}
      >
        {loading ? (
          <ClipLoader color="#E9EDEF" size={25} />
        ) : (
          <SendIcon className="fill-white" />
        )}
      </div>
    </div>
  )
}


export default HandleAndSendFile
