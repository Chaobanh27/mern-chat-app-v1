import SidebarHeader from '~/components/Sidebar/SidebarHeader/SidebarHeader'
import Search from './Search/Search'
import { useState } from 'react'
import SearchResults from './Search/SearchResult'
import AllConversations from '../Conversation/AllConversations'

export default function Sidebar({ onlineUsers, typing }) {
  const [searchResults, setSearchResults] = useState([])

  return (
    <div className="flex0030 max-w-[30%] h-full select-none">
      {/*Sidebar Header*/}
      <SidebarHeader />
      {/*Search*/}
      <Search
        searchLength={searchResults.length}
        setSearchResults={setSearchResults}
      />
      {searchResults.length > 0 ? (
        <>
          {/*Search results*/}
          <SearchResults searchResults={searchResults}/>
        </>
      ) : (
        <>
          {/*AllConversation*/}
          <AllConversations onlineUsers={onlineUsers} typing={typing}/>
        </>
      )}
    </div>
  )
}
