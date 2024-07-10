import { useSelector } from 'react-redux'
import { getConversationName, getConversationPicture } from '~/utils/chat'
import { capitalize } from '~/utils/string'
import { CallIcon, DotsIcon, SearchLargeIcon, VideoCallIcon } from '~/assets/svg/index'


function ChatHeader({ online, callUser }) {
  const { activeConversation } = useSelector((state) => state.chat)
  const { user } = useSelector((state) => state.user)

  return (
    <div className="h-[59px] dark:bg-dark_bg_2 flex items-center p16 select-none">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {/* ảnh cuộc trò chuyện*/}
          <button className="btn">
            <img
              src={
                activeConversation.isGroup
                  ? activeConversation.picture
                  : getConversationPicture(user, activeConversation.users)
              }
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          </button>
          {/*tên cuộc trò chuyện và tình trạng online*/}
          <div className="flex flex-col">
            <h1 className="dark:text-white text-md font-bold">
              {activeConversation.isGroup
                ? activeConversation.name
                : capitalize(
                  getConversationName(user, activeConversation.users).split(
                    ' '
                  )[0]
                )}
            </h1>
            <span className="text-xs dark:text-dark_svg_2">
              {online ? 'online' : 'offline'}
            </span>
          </div>
        </div>
        <ul className="flex items-center gap-x-2.5">
          <li>
            <button className="btn" onClick={() => callUser()}>
              <VideoCallIcon />
            </button>
          </li>
          <li>
            <button className="btn">
              <CallIcon />
            </button>
          </li>
          <li>
            <button className="btn">
              <SearchLargeIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>
          <li>
            <button className="btn">
              <DotsIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ChatHeader
