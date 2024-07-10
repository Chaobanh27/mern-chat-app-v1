import { DownloadIcon } from '~/assets/svg/index'
import { getFileImage } from '~/utils/FileImage'

export default function FileOthers({ file, type }) {

  return (
    <div className="bg-green_4 p-2 rounded-lg">
      <div className="flex justify-between gap-x-8">
        <div className="flex items-center gap-2">
          <img
            src={getFileImage(type)}
            alt=""
            className="w-8 object-contain"
          />
          <div className="flex flex-col gap-2">
            <h1>
              {file.original_filename}.{file.public_id.split('.')[1]}
            </h1>
            <span className="text-sm">
              {type} . {file.bytes/1000}Kb
            </span>
          </div>
        </div>

        <a href={file.secure_url} target='_blank' rel='noreferrer' download>
          <DownloadIcon />
        </a>
      </div>
    </div>
  )
}
