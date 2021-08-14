import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'

// Components
import Layout from './src/components/layout'

// Theme
import theme from './src/theme/theme'
import './src/theme/global.scss'

export const wrapRootElement = ({ element }) => {
  return <ThemeProvider theme={theme}>{element}</ThemeProvider>
}

export const wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>
}

export const onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([<script src="https://cdn.attn.tv/bosspersonalplanner/dtag.js" />])
}
