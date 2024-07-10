import { capitalize } from '~/utils/string'
import CallTime from './CallTime'

const CallInfo = ({ name, totalSecInCall, setTotalSecInCall, callAccepted }) => {

  return (
    <div className="absolute top-12 z-40 w-full p-1">
      <div className="flex flex-col items-center">
        {/*Call infos*/}
        <div className="flex flex-col items-center gap-y-1">
          <h1 className="text-white text-lg">
            <b>{name ? capitalize(name) : ''}</b>
          </h1>
          {totalSecInCall === 0 ? (
            <span className="text-dark_text_1">Ringing...</span>
          ) : null}
          <CallTime
            totalSecInCall={totalSecInCall}
            setTotalSecInCall={setTotalSecInCall}
            callAccepted={callAccepted}
          />
        </div>
      </div>
    </div>
  )
}

export default CallInfo