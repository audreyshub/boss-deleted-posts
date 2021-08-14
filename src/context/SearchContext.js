import React, { useState, useContext } from 'react'

const SearchContext = React.createContext(0)
SearchContext.displayName = 'SearchContext'

export function SearchContextProvider({ children }) {
  const [searchShowed, setSearchShowed] = useState(false)

  return (
    <SearchContext.Provider value={[searchShowed, setSearchShowed]}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearchContext() {
  const [searchShowed, setSearchShowed] = useContext(SearchContext)

  return {
    searchShowed,
    setSearchShowed,
  }
}
