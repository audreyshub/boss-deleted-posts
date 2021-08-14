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

export const onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    // <script id="gorgias-chat-widget-install" src="/gorgias.js" async />,
    <script src="https://cdn.attn.tv/bosspersonalplanner/dtag.js" />,
    <script
      type="text/javascript"
      async
      src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=LNEyda"
    ></script>,
    // <script
    //   async
    //   defer
    //   src="https://static.cdn.prismic.io/prismic.js?new=true&repo=bossplanner"
    // ></script>,
  ])
}
