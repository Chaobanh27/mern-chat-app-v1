import { useDispatch, useSelector } from 'react-redux'
import { CloseIcon } from '~/assets/svg/index'
import { clearFiles } from '~/redux/chat/chatSlice'

const FilesPreviewHeader = ({ activeIndex }) => {

  const dispatch = useDispatch()
  const { files } = useSelector((state) => state.chat)

  const clearFilesHandler = () => {
    dispatch(clearFiles())
  }
  return (
    <div className="w-full ">
      {/*Container*/}
      <div className="w-full flex items-center justify-between">
        {/*Close icon / empty files*/}
        <div
          className="translate-x-4 cursor-pointer"
          onClick={() => clearFilesHandler()}
        >
          <CloseIcon className="dark:fill-dark_svg_1" />
        </div>
        {/* File name */}
        <h1 className="dark:text-dark_text_1 text-[15px]">
          {files[activeIndex]?.file?.name}
        </h1>
        {/*Empty tag*/}
        <span></span>
      </div>
    </div>
  )
}

export default FilesPreviewHeader
