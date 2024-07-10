import { AddContactIcon, ArrowIcon, LockIcon } from '~/assets/svg/index'

const CallHeader = () => {
  return (
    <header className="absolute top-0 w-full z-40">
      <div className="p-1 flex items-center justify-between">
        <button className="btn">
          <span className="rotate-180 scale-150">
            <ArrowIcon className="fill-white" />
          </span>
        </button>
        <p className="flex items-center">
          <LockIcon className="fill-white scale-75" />
          <span className="text-xs text-white">End-to-end Encrypted</span>
        </p>
        <button className="btn">
          <AddContactIcon className="fill-white" />
        </button>
      </div>
    </header>
  )
}

export default CallHeader
