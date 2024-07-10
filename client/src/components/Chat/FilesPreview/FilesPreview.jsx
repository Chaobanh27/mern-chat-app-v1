import { useState } from 'react'
import FileViewer from './FileViewer'
import FilesPreviewHeader from './FilesPreviewHeader'
import FilesPreviewInput from './FilesPreviewInput'
import HandleAndSendFile from './HandleAndSendFile'

const FilesPreview = () => {
  const [message, setMessage] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <div className="relative py-2 w-full flex items-center justify-center">
      <div className="w-full flex flex-col items-center">
        {/*Header*/}
        <FilesPreviewHeader activeIndex={activeIndex} />
        {/*Viewing selected file*/}
        <FileViewer activeIndex={activeIndex} />
        <div className="w-full flex flex-col items-center">
          {/*Message Input*/}
          <FilesPreviewInput message={message} setMessage={setMessage} />
          {/*Send and manipulate files*/}
          <HandleAndSendFile
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            message={message}
          />
        </div>
      </div>
    </div>
  )
}

export default FilesPreview
