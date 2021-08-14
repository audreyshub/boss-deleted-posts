import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'

// Components
import Layout from './src/components/layout'

// Theme
import theme from './src/theme/theme'
import './src/theme/global.scss'

// Context
import { StoreCheckoutContextProvider } from './src/context/StoreCheckoutContext'
import { LoyaltyLionProvider } from './src/context/LoyaltyLionContext'

export const wrapRootElement = ({ element }) => {
  return <ThemeProvider theme={theme}>{element}</ThemeProvider>
}

export const wrapPageElement = ({ element, props }) => {
  return (
    <StoreCheckoutContextProvider>
      <LoyaltyLionProvider {...props}>
        <Layout {...props}>{element}</Layout>
      </LoyaltyLionProvider>
    </StoreCheckoutContextProvider>
  )
}
