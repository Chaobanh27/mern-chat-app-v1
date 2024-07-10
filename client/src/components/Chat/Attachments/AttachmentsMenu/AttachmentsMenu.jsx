import DocumentAttachment from './DocumentAttachment'
import PhotoAttachment from './PhotoAttachment'


const AttachmentsMenu = () => {
  return (
    <ul className="absolute bottom-14 openEmojiAnimation">
      <li>
        <DocumentAttachment />
      </li>
      <li>
        <PhotoAttachment />
      </li>
    </ul>
  )
}

export default AttachmentsMenu