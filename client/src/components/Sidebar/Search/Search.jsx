import { useState } from 'react'
import { useSelector } from 'react-redux'
import { FilterIcon, ReturnIcon, SearchIcon } from '~/assets/svg/index'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export default function Search({ searchLength, setSearchResults }) {
  const { user } = useSelector((state) => state.user)
  const { access_token } = user
  const [show, setShow] = useState(false)

  const handleSearch = async (e) => {
    if (e.target.value && e.key === 'Enter') {
      try {
        const { data } = await authorizedAxiosInstance.get(
          `${API_ROOT}/user?search=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          }
        )
        setSearchResults(data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      }
    } else {
      setSearchResults([])
    }
  }


  return (
    <div className="h-[49px] py-1.5">
      <div className="px-[10px]">
        <div className="flex items-center gap-x-2">
          <div className="w-full flex dark:bg-dark_bg_2 rounded-lg pl-2">
            {show || searchLength > 0 ? (
              <span
                className="w-8 flex items-center justify-center rotateAnimation cursor-pointer"
                onClick={() => setSearchResults([])}
              >
                <ReturnIcon className="fill-green_1 w-5" />
              </span>
            ) : (
              <span className="w-8 flex items-center justify-center ">
                <SearchIcon className="dark:fill-dark_svg_2 w-5" />
              </span>
            )}
            <input
              type="text"
              placeholder="Search or start a new chat"
              className="input"
              onFocus={() => setShow(true)}
              onBlur={() => searchLength == 0 && setShow(false)}
              onKeyDown={(e) => handleSearch(e)}
            />
          </div>
          <button className="btn">
            <FilterIcon className="dark:fill-dark_svg_2" />
          </button>
        </div>
      </div>
    </div>
  )
}
