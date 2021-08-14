import React, { useState, useContext } from 'react'

const CurrentVariantContext = React.createContext()
CurrentVariantContext.displayName = 'CurrentVariantContext'

export function CurrentVariantContextProvider({ children }) {
  const [currentVariant, setCurrentVariant] = useState()

  // console.log('CURRENT VARIANT CONTEXT', currentVariant)
  return (
    <CurrentVariantContext.Provider value={[currentVariant, setCurrentVariant]}>
      {children}
    </CurrentVariantContext.Provider>
  )
}

export function useCurrentVariantContext() {
  const [currentVariant, setCurrentVariant] = useContext(CurrentVariantContext)
  // console.log('current variant', currentVariant)

  return {
    currentVariant,
    setCurrentVariant,
  }
}
