import { AttachmentIcon } from '~/assets/svg/index'
import AttachmentsMenu from './AttachmentsMenu/AttachmentsMenu'

export default function Attachments({ showAttachments, setShowAttachments, setShowPicker }) {
  return (
    <li className="relative">
      <button
        onClick={() => {
          setShowPicker(false)
          setShowAttachments((prev) => !prev)
        }}
        type="button"
        className="btn"
      >
        <AttachmentIcon className="dark:fill-dark_svg_1" />
      </button>
      {showAttachments ? <AttachmentsMenu /> : null}
    </li>
  )
}
